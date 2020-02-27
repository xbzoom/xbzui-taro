import { MouseEvent, ComponentClass } from 'react'

export interface ShareCanvasProps {
  title?: string

  children?: any

  visible: boolean

  btnId?: string

  footer?: any

  close?: () => void

  saveCanvas?: () => void
}

declare const ShareCanvas: ComponentClass<ShareCanvasProps>

export default ShareCanvas
