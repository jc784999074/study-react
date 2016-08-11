require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//let yeomanImage = require('../images/yeoman.png');
//获取图片
var imageDatas = require('../data/image.json');
//拉出URL
imageDatas = (function getImages(imageDatas) {
  for (var i = 0, j = imageDatas.length; i < j; i++) {
    var image = imageDatas[i];

    image.imageURL = require('../images/' + image.fileName);

    imageDatas[i] = image;
  }
  return imageDatas;
})(imageDatas);

//获取区间内的一个随机值
function getRangeRandom(low,hign) {
  return Math.ceil(Math.random()*(hign - low) + low);
}
function get30DegRandom() {
  return Math.random() > 0.5 ? '' : '-' +  Math.ceil(Math.random() * 30)
}
//控制组件
var ControllerUnit=React.createClass({
  handleClick:function(e) {
    //如果电机的是选中态的按钮，翻转，否则居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  },
  render:function() {
    var controllerUnitClasssName = 'controller-unit';

    //如果对应的是居中的图片，显示控制按钮居中
    if(this.props.arrange.isCenter){
      controllerUnitClasssName +=' is-center';
      //如果同时对应的是翻转图片，翻转
      if(this.props.arrange.isInvers){
        controllerUnitClasssName += ' is-inverse';
      }
    }
    return (
      <span className={controllerUnitClasssName} onClick={this.handleClick}></span>
    );
  }
});
var ImgFigure = React.createClass( {
  //图片点击事件
  handleClick:function(e) {
    if(this.props.arrange.isCenter){
      this.props.isInvers();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },
  render:function (){

  var styleObj = {};

  //如果props属性中指定了这张图片的位置，则使用
  if(this.props.arrange.pos){
    styleObj = this.props.arrange.pos;
  }
  //如果图片的旋转角度有值并且不为0，添加旋转角度
  if(this.props.arrange.rotate){
    (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function (value) {
      styleObj[ value ] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }.bind(this));
  }
  var imgFigureClassName = 'img-figure';
      imgFigureClassName += this.props.arrange.isInvers ? ' is-inverse':'';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src ={this.props.data.imageURL} alt={this.props.data.title}  />
        <figcaption>
          <h2>{this.props.data.description}</h2>
          <div className='img-back' onClick={this.handleClick}>
            <p>
              {this.props.data.description}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
})

var AppComponent = React.createClass( {
  Constant : {
      centerPos:{
        left:0,
        right:0
      },
      hPosRange:{//水平方向取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{//垂直方向取值范围
        x:[0,0],
        topY:[0,0]
      }
  },
  /*
  *翻转图片param index输入当前被执行inverse操作的图片对应的图片信息数组的index值
  *return 一个闭包函数，其内return一个真正被执行的函数
  */
  isInvers: function(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInvers = !imgsArrangeArr[index].isInvers;
      
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })
    }.bind(this);
  },
  //重新布局所有图片，指定哪个图片居中
  rearrange:function(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos= Constant.centerPos,
        hPosRange= Constant.hPosRange,
        vPosRange= Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX= hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr=[],
        topImgNum = Math.floor(Math.random()*2),//一个或者不取
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

        //首先居中centerIndex的图片,无需旋转
        imgsArrangeCenterArr[0]={
          pos:centerPos,
          rotate:0,
          isCenter:true
        }

        //取出要布局上侧的状态信息
        topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));

        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index) {
          imgsArrangeTopArr[index]={
            pos : {
              top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          }
        });

        //布局左右两侧的图片
        for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
          var hPosRangeLORX = null;

          //前半部分布局左边，后半部分布局右边
          if(i<k){
            hPosRangeLORX = hPosRangeLeftSecX;
          }else{
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
              pos : {
              top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
            },
            rotate : get30DegRandom(),
            isCenter:false
          }
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });
  },
  /*
  *利用rearrange凹函数，居中对应index图片
  *@param  index ，需要被居中的图片信息的index值
  *@return{function}
  */
  center:function(index) {
    return function() {
      this.rearrange(index);
    }.bind(this);
  },
  getInitialState:function () {
    return{
      imgsArrangeArr:[
        /*{
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false, //图片正反面,默认正面
          isCenter:false   //是否居中
        }*/
      ]
    }
  },
  //组件加载后，计算图片范围
  componentDidMount:function (){debugger;
    //舞台大小
    var stageDOM=this.refs.stage,
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW= Math.ceil(stageW/2),
        halfStageH=Math.ceil(stageH/2);

    var imgFigureDOM = document.getElementsByTagName('img')[0],//component无法用ref获取未知原因
        imgW = imgFigureDOM.parentNode.scrollWidth,
        imgH = imgFigureDOM.parentNode.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);
    
    //中心图片位置点
    this.Constant.centerPos = {
      left:halfStageW-halfImgW,
      top :halfStageH-halfImgH
    }
    //计算左右区域图片排布位置范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;
    this.Constant.hPosRange.rightSecX[0]= halfImgW + halfStageW;
    this.Constant.hPosRange.rightSecX[1]= stageW-halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
    this.Constant.vPosRange.x[0]    = halfStageW - imgW;
    this.Constant.vPosRange.x[1]    = halfStageW;
    
    this.rearrange(0);
    
  },
  render:function (){
    var controllerUnits = [],
      imgFigures = [];

      imageDatas.forEach(function(element,index) {

        if(!this.state.imgsArrangeArr[index]){
          this.state.imgsArrangeArr[index] = {
            pos:{
              left:0,
              top:0
            },
            rotate:0,
            isInvers:false,
            isCenter:false
          }
        }

        imgFigures.push(
          <ImgFigure data={element} key = {index} ref = {'imgFigure'+index}  key = {'imgFigure'+index}   arrange={this.state.imgsArrangeArr[index]} isInvers={this.isInvers(index)} center={this.center(index)} />)
          controllerUnits.push(<ControllerUnit key = {index} arrange={this.state.imgsArrangeArr[index]} inverse={this.isInvers(index)} center={this.center(index)}/>);
        }.bind(this));
    return (
      
      <section className='stage' ref='stage' style={{height:document.documentElement.clientHeight+'px'}}>
        <section className='img-sec'>
          {imgFigures}
        </section>
        <nav className = 'controller-nav'>
          {controllerUnits}
        </nav>
      </section>
    )
  }
})

export default AppComponent;
