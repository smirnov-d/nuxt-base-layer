import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

export function useVirtualScroll(props, listRef, rowRefs, containerRef) {
  const scrollTop = ref(0)
  const topPadding = ref(0)
  const bottomPadding = ref(0)

  const rowHeights = ref(new Map())
  const totalHeight = ref(0)
  const startIndex = ref(0)
  const endIndex = ref(0)

  const bufferSize = 5 // buffer rows

  // const rowAvgHeight.value = 40 // Default row height
  const rowAvgHeight = computed(() => {
    const avg =
      Array.from(rowHeights.value.values()).reduce(
        (acc, height) => acc + height,
        0
      ) / rowHeights.value.size
    // console.log(Array.from(rowHeights.value.values()))
    return avg || 40
  })

  let observer = null
  let resizeObserver = null

  const updateRowHeights = () => {
    let sum = 0
    rowRefs.value.forEach((row, id) => {
      if (row) {
        const height = row.getBoundingClientRect().height
        if (height > 0) {
          rowHeights.value.set(id, height)
        }
        sum += height
      }
    })
    totalHeight.value = sum
  }

  const getVisibleRange = () => {
    nextTick(() => {
      // console.log('getVisibleRange')
      let sum = 0
      let start = 0

      for (let i = 0; i < itemsWithIndexes.value.length; i++) {
        const id = itemsWithIndexes.value[i].virtualScrollIdx
        sum += rowHeights.value.get(id) || rowAvgHeight.value
        if (sum > scrollTop.value) {
          start = Math.max(0, i - bufferSize) // Отматываем назад буфер
          break
        }
      }

      let end = start + bufferSize // не накапливаем повторно высоты строк, попавших в буфер
      while (
        sum <
          scrollTop.value +
            (scrollParent.value?.clientHeight || window.innerHeight) &&
        end < itemsWithIndexes.value.length
      ) {
        const id = itemsWithIndexes.value[end].virtualScrollIdx
        sum += rowHeights.value.get(id) || rowAvgHeight.value
        end++
      }
      // endIndex.value = Math.min(props.items.value.length - 1, end + bufferSize) // add buffer
      endIndex.value = Math.min(itemsWithIndexes.value.length, end + bufferSize) // add buffer
      startIndex.value = Math.max(0, start)

      updateRowHeights()
      updateRowHeights()
    })
  }

  watch(
    () => props.items,
    () => {
      rowHeights.value.clear()
      nextTick(() => {
        updateRowHeights()
        getVisibleRange()
      })
    },
    { deep: true }
  )

  watch(
    scrollTop,
    () => {
      updateRowHeights()
      getVisibleRange()
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
    // debugger
    for (let i = endIndex.value; i < itemsWithIndexes.value.length - 1; i++) {
      bottomSum +=
        rowHeights.value.get(itemsWithIndexes.value[i].virtualScrollIdx) ||
        rowAvgHeight.value
    }
    bottomPadding.value = bottomSum
  })

  const onScroll = () => {
    // const container = containerRef.value
    // scrollableEl.value = getScrollParent(container)
    // console.log(
    //   scrollParent.value?.scrollTop,
    //   event.target.scrollTop,
    //   document.scrollingElement?.scrollTop
    // )
    // scrollTop.value = top
    scrollTop.value =
      (scrollParent.value !== window
        ? scrollParent.value?.scrollTop
        : document.scrollingElement?.scrollTop) || 0
    // scrollTop.value = event.target.scrollTop
  }

  const scrollParent = ref(null)

  function getScrollParent(node) {
    if ([undefined, null, document.documentElement].includes(node)) {
      return window
    }

    if (
      window.getComputedStyle(node)?.overflow !== 'visible' &&
      node.scrollHeight >= node.clientHeight
    ) {
      return node
    } else {
      return getScrollParent(node?.parentNode)
    }
  }

  onMounted(() => {
    scrollParent.value = getScrollParent(containerRef.value?.parentNode)
    // scrollParent.value = getScrollParent(list.value)
    if (scrollParent.value !== window) {
      scrollParent.value.addEventListener('scroll', onScroll)
    } else {
      window.addEventListener('scroll', onScroll)
    }
    updateRowHeights()
  })

  onUnmounted(() => {
    if (scrollParent.value !== window) {
      scrollParent.value.removeEventListener('scroll', onScroll)
    } else {
      window.removeEventListener('scroll', onScroll)
    }
  })

  const observeRowChanges = () => {
    if (!listRef.value) return

    observer = new MutationObserver(() => {
      nextTick(() => updateRowHeights())
    })

    observer.observe(listRef.value, { childList: true, subtree: true })
  }

  const observeResizeChanges = () => {
    if (!rowRefs.value) return

    resizeObserver = new ResizeObserver(() => {
      nextTick(() => updateRowHeights())
    })

    rowRefs.value.forEach((row) => {
      if (row) {
        resizeObserver.observe(row)
      }
    })
  }

  onMounted(() => {
    nextTick(() => {
      // updateRowHeights()
      observeRowChanges()
      observeResizeChanges()
    })
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
    if (resizeObserver) resizeObserver.disconnect()
  })

  return {
    visibleItems,
    topPadding,
    bottomPadding,
    onScroll,
    updateRowHeights,
    rowHeights,
  }
}
