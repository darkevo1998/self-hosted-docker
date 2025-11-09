import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { dynamicTranslationClient } from '@/lib/dynamic-translation-client'

const OBSERVER_CONFIG: MutationObserverInit = {
  characterData: true,
  childList: true,
  subtree: true,
}

export function AutoTranslationProvider() {
  const { i18n } = useTranslation()
  const pendingNodesRef = useRef(new Map<Text, string>())
  const failedPhrasesRef = useRef(new Set<string>())

  useEffect(() => {
    let cancelled = false
    dynamicTranslationClient
      .checkStatus()
      .then((enabled) => {
        if (cancelled) {
          return
        }
        if (!enabled) {
          console.warn(
            '[translation] Auto translation will be skipped because the server does not have AP_GOOGLE_TRANSLATE_API_KEY configured.',
          )
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('[translation] Unexpected error while checking translation status.', error)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cleanupRemoved = useCallback((node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      pendingNodesRef.current.delete(node as Text)
      return
    }
    node.childNodes.forEach((child) => cleanupRemoved(child))
  }, [])

  const processTextNode = useCallback(
    (node: Text) => {
      const content = node.nodeValue
      if (!content) {
        pendingNodesRef.current.delete(node)
        return
      }

      if (pendingNodesRef.current.get(node) === content) {
        return
      }

      if (!shouldConsider(content)) {
        pendingNodesRef.current.delete(node)
        return
      }

      const trimmed = content.trim()
      if (failedPhrasesRef.current.has(trimmed)) {
        return
      }

      pendingNodesRef.current.set(node, content)

      dynamicTranslationClient
        .translate({
          text: content,
          targetLanguage: i18n.language,
        })
        .then((translated) => {
          if (!node.isConnected) {
            return
          }
          if (pendingNodesRef.current.get(node) !== content) {
            return
          }
          pendingNodesRef.current.delete(node)
          const applied = translated && translated !== content
          if (applied) {
            console.log('[translation] Applied translation to node', {
              targetLanguage: i18n.language,
              originalPreview: previewText(content),
              translatedPreview: previewText(translated),
            })
            node.nodeValue = translated
          }
          else {
            console.log('[translation] No translation applied (already matches target language)', {
              targetLanguage: i18n.language,
              textPreview: previewText(content),
            })
          }
        })
        .catch((error) => {
          pendingNodesRef.current.delete(node)
          failedPhrasesRef.current.add(trimmed)
          console.warn('[translation] Failed to translate node', {
            targetLanguage: i18n.language,
            textPreview: previewText(content),
            error,
          })
        })
    },
    [i18n.language],
  )

  const walkNode = useCallback(
    (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node as Text)
        return
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        if (shouldSkipElement(element)) {
          return
        }
        element.childNodes.forEach((child) => walkNode(child))
      }
    },
    [processTextNode],
  )

  useEffect(() => {
    pendingNodesRef.current.clear()
    failedPhrasesRef.current.clear()
    dynamicTranslationClient.clearCache()

    if (isEnglish(i18n.language)) {
      return
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
          processTextNode(mutation.target as Text)
        }
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => walkNode(node))
          mutation.removedNodes.forEach((node) => cleanupRemoved(node))
        }
      }
    })

    observer.observe(document.body, OBSERVER_CONFIG)
    walkNode(document.body)

    return () => {
      observer.disconnect()
      pendingNodesRef.current.clear()
    }
  }, [cleanupRemoved, i18n.language, processTextNode, walkNode])

  return null
}

function shouldConsider(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.length < 3) {
    return false
  }
  if (trimmed.length > 500) {
    return false
  }
  if (!/[A-Za-z]/.test(trimmed)) {
    return false
  }
  if (/[\u0400-\u04FF]/.test(trimmed) || /[\u3040-\u30FF]/.test(trimmed) || /[\u4E00-\u9FFF]/.test(trimmed)) {
    return false
  }
  if (/^[\d\s.,:;()+\-/_]*$/.test(trimmed)) {
    return false
  }
  const asciiLetters = trimmed.replace(/[^A-Za-z]/g, '').length
  if (asciiLetters / trimmed.length < 0.5) {
    return false
  }
  if (/^[A-Z\d\s]{1,6}$/.test(trimmed)) {
    return false
  }
  if (/\{\{|\}\}|%\(|%s|<[^>]+>/.test(trimmed)) {
    return false
  }
  return true
}

function shouldSkipElement(element: Element): boolean {
  const tagName = element.tagName.toLowerCase()
  if (['script', 'style', 'code', 'pre', 'noscript', 'svg'].includes(tagName)) {
    return true
  }
  const htmlElement = element as HTMLElement
  if (htmlElement.isContentEditable) {
    return true
  }
  if (element.hasAttribute('data-no-auto-translate')) {
    return true
  }
  return false
}

function isEnglish(language: string): boolean {
  const normalized = language.toLowerCase()
  return normalized === 'en' || normalized.startsWith('en-')
}

function previewText(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length <= 40) {
    return trimmed
  }
  return `${trimmed.slice(0, 37)}...`
}


