import { Button } from '@mui/material'
import { useState } from 'react'
import {
  ShapeEditor,
  ImageLayer,
  SelectionLayer,
  wrapShape,
  Rectangle,
} from 'react-shape-editor'
import omit from 'lodash.omit'

import styled from 'styled-components'
import useWindowSize from 'renderer/hooks/useWindowSize'

const Container = styled.div`
  width: 70%;

  img {
    width: 100%;
  }
`

const RectShape = wrapShape(({ width, height }) => (
  <rect width={width} height={height} fill="rgba(0,0,255,0.5)" />
))

interface Props {
  imgSrc: string
  handleFacecamSelected: (rect: Rectangle) => void
}

const FacecamSelection = ({ imgSrc, handleFacecamSelected }: Props) => {
  const [item, setItem] = useState({
    id: '1',
    x: 20,
    y: 120,
    width: 0,
    height: 0,
  })

  const [{ vectorHeight, vectorWidth }, setVectorDimensions] = useState({
    vectorHeight: 0,
    vectorWidth: 0,
  })

  const [selectedShapeIds, setSelectedShapeIds] = useState(['1'])

  const { id, height, width, x, y } = item

  const shape = (
    <RectShape
      key={id}
      active={selectedShapeIds.indexOf(id) >= 0}
      shapeId={id}
      shapeIndex={0}
      height={height}
      width={width}
      x={x}
      y={y}
      onChange={(newRect) => {
        const modifiedRect = {
          ...newRect,
        }
        if (newRect.x < 0) {
          modifiedRect.x = 0
        }
        if (newRect.y < 0) {
          modifiedRect.y = 0
        }
        if (newRect.x + newRect.width > vectorWidth) {
          modifiedRect.x = vectorWidth - newRect.width
        }
        if (newRect.y + newRect.height > vectorHeight) {
          modifiedRect.y = vectorHeight - newRect.height
        }

        setItem((currentItem) => ({
          ...currentItem,
          ...modifiedRect,
        }))
      }}
    />
  )

  const windowSize = useWindowSize()

  return (
    <Container>
      <ShapeEditor
        vectorWidth={vectorWidth}
        vectorHeight={vectorHeight}
        scale={(windowSize.width / vectorWidth) * 0.9}
      >
        <ImageLayer
          src={imgSrc}
          onLoad={({ naturalWidth, naturalHeight }) => {
            setVectorDimensions({
              vectorWidth: naturalWidth,
              vectorHeight: naturalHeight,
            })
            setItem({
              ...item,
              width: 0.2 * naturalWidth,
              height: 0.2 * naturalHeight,
            })
          }}
        />
        <SelectionLayer
          selectedShapeIds={selectedShapeIds}
          onSelectionChange={(ids) => setSelectedShapeIds(ids)}
          keyboardTransformMultiplier={5}
        >
          {shape}
        </SelectionLayer>
      </ShapeEditor>
      <Button
        variant="contained"
        onClick={() => handleFacecamSelected(omit(item, 'id'))}
      >
        Done
      </Button>
    </Container>
  )
}

export default FacecamSelection
