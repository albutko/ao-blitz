import React, { Component } from 'react';
import NodeGroup from 'react-move/NodeGroup';
import './race.css';
import { getSheetData, getRandomData } from './helpers.js'

import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { easeCubicInOut } from 'd3-ease';
import ImageMap from './imageMap.js'

function RacerGroup(props){
  return (
    <div className="race-lane" >
      <h1 style={{position:'absolute', top:'50%'}}> {props.data.rep}</h1>
      <img src={require('./assets/smoke.png')} alt="fun smoke" width={`${props.state.imgSize}px`}
      style={{position: 'relative',left: props.state.xVal+'px',opacity:props.state.smokeOpacity}}/>
      <img src={ImageMap.get(props.data.rep)} alt={props.data.rep} height={`${props.state.imgSize}px`}
       style={{position: 'relative',left: props.state.xVal+'px'}}/>
       <h1 style={{position: 'relative',left: props.state.xVal + 'px', bottom:'50%'}}>{Math.round(props.data.points)}</h1>
    </div>

  )
}


class Race extends Component{
  constructor(props){
      super(props)
      this.state = {
        currentData: null,
        pastData: null,
        width:  window.innerWidth,
        height:  window.innerHeight,
        xScale: scaleLinear().clamp(true).domain([0,100]).range([20, window.innerWidth*.75]),
        imgSize: (window.innerHeight)/10,
      }
      this.updateData = this.updateData.bind(this);
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  updateData(){
    getSheetData().then( newData =>
      {
      this.setState({
        pastData: this.state.currentData,
        xScale: this.state.xScale.domain([0, Math.max(max(newData, d=>d.points), 100)]),
        currentData: newData
      });
    });
  }

  componentDidMount(){
    this.interval = setInterval(() => this.updateData(), 5000);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateData();
  }

  componentWillUnmount(){
    clearInterval(this.interval);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth,
                    height: window.innerHeight,
                    xScale: this.state.xScale.range([25, window.innerWidth*.75]),
                    imgSize: (window.innerHeight)/10,});
  }

  render(){
    return (
      <div className="race-track">
          <NodeGroup
            data={this.state.currentData}
            start={(d, i) => ({
              xVal:[this.state.xScale(0)],
              imgSize: this.state.imgSize,
              smokeOpacity: 0,
            })}

            enter={(d) => ({
              xVal: [this.state.xScale(d.points)]
            })}
            update={(d, i) => {
              const pastVal = this.state.pastData.filter((e) => d.rep === e.rep)[0].points;
              return {
              xVal: [this.state.xScale(d.points)],
              imgSize: this.state.imgSize,
              timing: { delay: 1000*Math.random(), duration: 4000, ease: easeCubicInOut },
              smokeOpacity: d.points > pastVal ? [0, .5] : 0,
            }}}

            leave={() => ({
              xVal: [this.state.xScale(0)]
            })}
            keyAccessor={d=>d.rep}
          >
            {nodes => (
              <div>
                {nodes.map(({key, data, state }) => (
                  <RacerGroup key={key} data={data} state={state} />
                ))}
              </div>
            )}
          </NodeGroup>
      </div>

    )
  }

}



export default Race
