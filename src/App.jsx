import React, { useEffect, useRef } from 'react';
import { dia, ui, shapes } from '@joint/plus';
import {convertSvgToJointCells} from './convertToJointCells.js'
import {scheme1} from './svg/scheme1.js'
import {scheme2} from './svg/scheme2.js'
import {scheme3} from './svg/scheme3.js'

import './App.scss';

function App() {

  const canvas: any = useRef(null);
  const [currentFile, setCurrentFile] = React.useState(scheme1)

  useEffect(() => {
    const graph = new dia.Graph({}, { cellNamespace: shapes });

    const { paperSize, cells } = convertSvgToJointCells(currentFile)

    const paper = new dia.Paper({
        model: graph,
        width: paperSize.width,
        height: paperSize.height,
        background: {
          color: '#F8F9FA',
        },
        frozen: true,
        async: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes
    });
    
    graph.addCells(cells)

    const scroller = new ui.PaperScroller({
        paper,
        autoResizePaper: true,
        cursor: 'grab'
    });

    paper.on('cell:pointerup', function(cellView) {
      // We don't want to transform links.
      if (cellView.model instanceof dia.Link) return;

      var freeTransform = new ui.FreeTransform({ cellView: cellView });
      freeTransform.render();
    });

    canvas.current.appendChild(scroller.el);
    scroller.render().center(); 

    paper.unfreeze();

    return () => {
        scroller.remove();
        paper.remove();
    };
  }, [currentFile]);

  return (
    <>
      <div className='menu'>
        <button onClick={() => setCurrentFile(scheme1)}> scheme1.svg </button>
        <button onClick={() => setCurrentFile(scheme2)}> scheme2.svg </button>
        <button onClick={() => setCurrentFile(scheme3)}> scheme3.svg </button>
      </div>
      <div className="canvas" ref={canvas}/>
    </>
  );

}

export default App;
