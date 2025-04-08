export interface VirtualScrollProps {
  items: Ref<unknown[]>
  itemHeight?: number
  bufferSize?: number
}

export function useVirtualScroll(
  props: VirtualScrollProps,
  listRef: Ref<HTMLElement | null>,
  rowRefs: Ref<(HTMLElement | null)[]>,
  containerRef: Ref<HTMLElement | null>
) {
  const { bufferSize = 5, itemHeight = 40 } = props

  const scrollTop = ref(0)
  const topPadding = ref(0)
  const bottomPadding = ref(0)

  const rowHeights = ref(new Map())
  const startIndex = ref(0)
  const endIndex = ref(0)

  const rowAvgHeight = computed(() => {
    const avg =
      Array.from(rowHeights.value.values()).reduce(
        (acc, height) => acc + height,
        0
      ) / rowHeights.value.size
    return avg || itemHeight
  })

  let observer: MutationObserver | null = null
  let resizeObserver: ResizeObserver | null = null

  const updateRowHeights = () => {
    rowRefs.value.forEach((row, id) => {
      if (row) {
        const height = row.getBoundingClientRect().height
        if (height > 0) {
          rowHeights.value.set(id, height)
        }
      }
    })
  }

  const getVisibleRange = async () => {
    await nextTick()

    let sum = 0
    let start = 0

    for (let i = 0; i < itemsWithIndexes.value.length; i++) {
      const id = itemsWithIndexes.value[i].virtualScrollIdx
      sum += rowHeights.value.get(id) || rowAvgHeight.value
      if (
        sum > Math.max(0, listRef.value?.getBoundingClientRect?.()?.top * -1)
      ) {
        start = Math.max(0, i - bufferSize)
        break
      }
    }

    let end = start + bufferSize // do not accumulate heights of rows that fall into the buffer
    while (
      sum <
      scrollTop.value +
      (scrollParent.value?.clientHeight ?? window.innerHeight) &&
      end < itemsWithIndexes.value.length
      ) {
      const id = itemsWithIndexes.value[end].virtualScrollIdx
      sum += rowHeights.value.get(id) || rowAvgHeight.value
      end++
    }
    endIndex.value = Math.min(itemsWithIndexes.value.length, end + bufferSize) // add buffer
    startIndex.value = Math.max(0, start)

    updateRowHeights()
  }

  watch(
    () => props.items.value,
    async () => {
      rowHeights.value.clear()
      await getVisibleRange()
    }
  )

  watch(
    scrollTop,
    async () => {
      await getVisibleRange()
    },
    { immediate: true }
  )

  const itemsWithIndexes = computed(() => {
    return props.items.value.map((item, index) => ({
      ...item,
      virtualScrollIdx: index,
    }))
  })

  const visibleItems = computed(() => {
    return itemsWithIndexes.value.slice(startIndex.value, endIndex.value)
  })

  watch([startIndex, endIndex], () => {
    let topSum = 0
    for (let i = 0; i < startIndex.value; i++) {
      topSum +=
        rowHeights.value.get(itemsWithIndexes.value[i].virtualScrollIdx) ||
        rowAvgHeight.value
    }
    topPadding.value = topSum

    let bottomSum = 0
    for (let i = endIndex.value; i < itemsWithIndexes.value.length - 1; i++) {
      bottomSum +=
        rowHeights.value.get(itemsWithIndexes.value[i].virtualScrollIdx) ||
        rowAvgHeight.value
    }
    bottomPadding.value = bottomSum
  })

  const onScroll = () => {
    scrollTop.value =
      (scrollParent.value === window
        ? document.scrollingElement?.scrollTop
        : scrollParent.value?.scrollTop) || 0
  }

  const scrollParent = ref<HTMLElement>()

  function getScrollParent(node: HTMLElement): HTMLElement | Window {
    if ([undefined, null, document.documentElement].includes(node)) {
      return window
    }

    if (
      window.getComputedStyle(node)?.overflow !== 'visible' &&
      node.scrollHeight > node.clientHeight
    ) {
      return node
    } else {
      return getScrollParent(node?.parentNode as HTMLElement)
    }
  }

  const controller = new AbortController()
  const { signal } = controller

  onMounted(async () => {
    scrollParent.value = getScrollParent(containerRef.value?.parentNode)
    scrollParent.value.addEventListener('scroll', onScroll, { signal })
    await getVisibleRange()
  })

  onUnmounted(() => {
    controller.abort()
  })

  const observeRowChanges = () => {
    if (!listRef.value) return

    observer = new MutationObserver(async () => {
      await nextTick()
      updateRowHeights()
    })

    observer.observe(listRef.value, { childList: true, subtree: true })
  }

  const observeResizeChanges = () => {
    if (!rowRefs.value) return

    resizeObserver = new ResizeObserver(async () => {
      await nextTick()
      updateRowHeights()
    })

    rowRefs.value.forEach((row) => {
      if (row) {
        resizeObserver?.observe(row)
      }
    })
  }

  onMounted(() => {
    observeRowChanges()
    observeResizeChanges()
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
    if (resizeObserver) resizeObserver.disconnect()
  })

  return {
    visibleItems,
    topPadding,
    bottomPadding,
    rowHeights,
  }
}
