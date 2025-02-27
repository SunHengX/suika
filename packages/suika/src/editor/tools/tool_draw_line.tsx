import cloneDeep from 'lodash.clonedeep';
import { Editor } from '../editor';
import { Line } from '../scene/line';
import { DrawGraphTool } from './tool_draw_graph';
import { ITool } from './type';
import { IRect } from '@suika/geo';
import { adjustSizeToKeepPolarSnap } from '../../utils/geo';
import { transformRotate } from '@suika/geo';
import { normalizeRadian } from '@suika/geo';

export class DrawLineTool extends DrawGraphTool implements ITool {
  static override readonly type = 'drawLine';
  override readonly type = 'drawLine';
  override readonly hotkey = 'l';

  constructor(editor: Editor) {
    super(editor);
    this.commandDesc = 'Add Line';
  }

  protected createGraph(rect: IRect, noMove: boolean) {
    // do not create line if no drag
    if (noMove) {
      return null;
    }
    const attrs = this.calcAttrs(rect);
    return new Line({
      ...attrs,
      height: 0,
      stroke: [cloneDeep(this.editor.setting.get('firstStroke'))],
      strokeWidth: this.editor.setting.get('strokeWidth'),
    });
  }

  protected override adjustSizeWhenShiftPressing(rect: IRect) {
    return adjustSizeToKeepPolarSnap(rect);
  }

  protected override updateGraph(rect: IRect) {
    const attrs = this.calcAttrs(rect);
    Object.assign(this.drawingGraph!, attrs);
  }

  private calcAttrs({ x, y, width, height }: IRect) {
    const rotation = normalizeRadian(Math.atan2(height, width));
    const cx = x + width / 2;
    const cy = y + height / 2;
    const p = transformRotate(x, y, -rotation, cx, cy);
    width = Math.sqrt(width * width + height * height);
    return {
      x: p.x,
      y: p.y,
      width,
      rotation,
    };
  }
}
