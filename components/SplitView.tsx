import React, { createRef, ReactChild, useEffect, useState } from "react"

type Props = {
  children?: ReactChild | ReactChild[]
  direction: "vertical" | "horizontal"
  minSize: number
}

const SplitView = (props: Props) => {
  const [dragging, setDragging] = useState(false)
  const [dividerPosition, setDividerPosition] = useState<number | undefined>(
    undefined,
  )

  const isVertical = props.direction === "vertical"

  const leftView = createRef<HTMLDivElement>()
  const rightView = createRef<HTMLDivElement>()
  const splitView = createRef<HTMLDivElement>()
  const divider = createRef<HTMLDivElement>()

  const onMove = (movementX: number, movementY: number) => {
    if (!dragging || !leftView.current || !splitView.current) {
      return
    }

    const maxSize =
      (isVertical
        ? splitView.current.offsetHeight
        : splitView.current.offsetWidth) - props.minSize

    const newDividerPosition = Math.max(
      Math.min(
        (dividerPosition ?? leftView.current.offsetWidth) +
          (isVertical ? movementY : movementX),
        maxSize,
      ),
      props.minSize,
    )
    leftView.current.style.width = `${newDividerPosition}px`
    setDividerPosition(newDividerPosition)
  }

  const onDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log(divider.current)
    //setDividerPosition(isVertical ? e.clientY : e.clientX)
    //setDividerPosition(isVertical ? e.clientY : e.clientX)
    setDragging(true)
  }

  const onDividerTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    //setDividerPosition(isVertical ? e.touches[0].clientY : e.touches[0].clientX)
    setDragging(true)
  }

  const onDividerMouseUp = () => {
    setDragging(false)
  }

  const onDividerMouseMove = (e: MouseEvent) => {
    e.preventDefault()
    onMove(e.movementX, e.movementY)
  }

  let previousTouch: Touch | null = null

  const onDividerTouchEnd = (e: TouchEvent) => {
    e.preventDefault()
    previousTouch = null
    setDragging(false)
  }

  const onDividerTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    const movementX = touch.pageX - (previousTouch?.pageX ?? 0)
    const movementY = touch.pageY - (previousTouch?.pageY ?? 0)
    onMove(movementX, movementY)
    previousTouch = touch
  }

  useEffect(() => {
    document.addEventListener("mousemove", onDividerMouseMove)
    document.addEventListener("mouseup", onDividerMouseUp)
    document.addEventListener("touchmove", onDividerTouchMove)
    document.addEventListener("touchend", onDividerTouchEnd)
    return () => {
      document.removeEventListener("mousemove", onDividerMouseMove)
      document.removeEventListener("mouseup", onDividerMouseUp)
      document.removeEventListener("touchmove", onDividerTouchMove)
      document.removeEventListener("touchend", onDividerTouchEnd)
    }
  })

  const directionClass = isVertical ? "vertical" : "horizontal"

  return (
    <div className="split-view" ref={splitView}>
      <div className="left-view" ref={leftView}>
        <p>EXAMPLE TEXT LEFT VIEW</p>
        <p>Divider Position: {dividerPosition}</p>
      </div>
      <div
        onMouseDown={onDividerMouseDown}
        onTouchStart={onDividerTouchStart}
        className={"divider " + directionClass}
        ref={divider}
      ></div>
      <div className="right-view" ref={rightView}>
        <p>EXAMPLE TEXT RIGHT VIEW</p>
        <p>Divider Position: {dividerPosition}</p>
      </div>
      <style jsx>{`
        .split-view {
          width: 100%;
          display: flex;
          flex-direction: row;
        }
        .divider {
          background-color: darkgray;
        }
        .divider.vertical {
          height: 3px;
          max-height: 3px;
          width: 100%;
          cursor: row-resize;
        }
        .divider.horizontal {
          width: 3px;
          max-width: 3px;
          height: 100%;
          cursor: col-resize;
        }
        .left-view {
          width: 50%;
        }
      `}</style>
      {/*<style jsx>
        {`
          .left-view.vertical,
          .right-view.vertical {
            min-height": ${props.minSize}px
          }
          .left-view.horizontal,
          .right-view.horizontal {
            min-width: ${props.minSize}px
          }
        `}
        </style>*/}
      {/*
      <style jsx>
        {`
        .left-view {
          width: ${dividerPosition !== undefined
            ? dividerPosition + "px"
            : "50%"};
        }
      `}
      </style>
      */}
    </div>
  )
}

SplitView.defaultProps = {
  direction: "horizontal",
  minSize: 100,
}

export default SplitView
