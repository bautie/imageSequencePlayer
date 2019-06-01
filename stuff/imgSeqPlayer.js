
////////// イメージシーケンスプレイヤー

class ImageSequencePlayer {	

	rewTop() {
		this.numCur = document.getElementById( this.elmNames.numStart ).value;
		this.showCurrentFrame();
	}

	play() {											/////// 再生
		if ( this.timer ) { return; }
		this.updateParameters();
		this.timer = setInterval( this.showNextFrame.bind( this ), 1000 / this.fps );
	}

	rewPlay() {											/////// 逆再生
		if ( this.timer ) { return; }
		this.updateParameters();
		this.timer = setInterval( this.showPrevFrame.bind( this ), 1000 / this.fps );
	}

	stop() {											/////// 再生停止
		clearInterval( this.timer );
		this.timer = null;
	}

	moveByWheel( aEvent ) {								/////// ホイールでフレーム移動
		this.updateParameters();

		var speed = ( 0 < aEvent.deltaY ) ? -1 : 1;
		if ( true === aEvent.shiftKey ) { speed *= 10;}
		if ( true === aEvent.ctrlKey ) { speed *= 100;}
		this.numCur += speed;
		if ( this.numCur < 1 ) { this.numCur = 0; }
		this.showCurrentFrame();
		aEvent.preventDefault();	// スクロール禁止
	}

	showCurrentFrame() {								/////// 現在のフレーム表示

		var numCurStr = String( this.numCur );
		if ( 0 < this.numLen ) { // 桁数を補正する
			if ( numCurStr.length < this.numLen ) { // 補正桁数に満たない
				numCurStr = ( '00000000000000000000' + numCurStr ).slice( - this.numLen );
			}
		}

		var imgPath = this.dirPath + this.imgHead + numCurStr + this.imgTail;
		this.elmStatus.innerText = '';

		this.elmFileName.innerText = imgPath;

		try {
			this.elmFrame.src = imgPath;
			this.elmNumCur.value = this.numCur;
		} catch( e ) {
			this.numCur = 1;
		}

	}

	showLastFrame() {
		this.numCur = this.numLast;
		this.showCurrentFrame();
	}

	showNextFrame() {									/////// 次のフレーム表示
		this.numLast = this.numCur;
		this.numCur++;
		this.showCurrentFrame();
	}

	showPrevFrame() {									/////// 次のフレーム表示
		this.numLast = this.numCur;
		this.numCur--;
		this.showCurrentFrame();
	}


	updateParameters() {								/////// 入力パラメータ取り込み

		this.dirPath = document.getElementById( this.elmNames.dirPath ).value;
		this.dirPath = this.dirPath.replace( /\\/g, '/' );
		if ( this.dirPath.slice( -1 ) !== '/' ) { this.dirPath += '/'; }
		console.log( 'DIR_PATH=' + this.dirPath );

		this.imgHead	= document.getElementById( this.elmNames.imgHead ).value;
		this.imgTail	= document.getElementById( this.elmNames.imgTail ).value;
		this.imgHead	= document.getElementById( this.elmNames.imgHead ).value;
		this.numStart	= Number( document.getElementById( this.elmNames.numStart ).value );
		this.numEnd		= Number( document.getElementById( this.elmNames.numEnd   ).value );
		this.numCur		= Number( document.getElementById( this.elmNames.numCur   ).value );
		this.numLast	= this.numCur;
		this.fps		= Number( document.getElementById( this.elmNames.fps      ).value );
		this.numLen		= Number( document.getElementById( this.elmNames.numLen   ).value );

	}

	constructor( aElmNames ) {

		var self = this;

		this.elmNames = aElmNames;
		this.elmStatus   = document.getElementById( this.elmNames.status );
		this.elmNumCur   = document.getElementById( this.elmNames.numCur );
		this.elmFileName = document.getElementById( this.elmNames.fileName );

		var elmFrame  = document.getElementById( this.elmNames.dstFrame );
		this.elmFrame = elmFrame;
		this.elmFrame.onerror = function( e ) {
			elmFrame.src = 'stuff/blank.png';
			self.elmStatus.innerText = '読込エラー';
			self.stop();
			// self.showLastFrame();
		}

		this.elmFrame.onload = function( e ) {
			// self.elmStatus.innerText = '';
		}

		this.elmFrame.addEventListener( 'mousewheel', function( e ) { 
			self.moveByWheel( e );
		} );

		document.getElementById( this.elmNames.numCur ).addEventListener( 'change', function(e) {
			self.numCur = self.elmNumCur.value;
			self.showCurrentFrame();
		} );

		this.updateParameters();

		this.timer			= null;
		// this.numCur = this.numStart;
		this.showCurrentFrame();

	}

}

////////// アプリケーション側

var ImgSeqPlayer = null;	

var ElmNames = {
	fileName   : 'FILE_NAME',
	dstFrame   : 'DST_FRAME',
	dirPath    : 'DIR_PATH',
	imgHead    : 'IMG_HEAD',
	imgTail    : 'IMG_TAIL',
	numStart   : 'START_FRAME',
	numEnd     : 'END_FRAME',
	numCur     : 'CUR_FRAME',
	status     : 'STATUS',
	fps        : 'FPS',
	numLen     : 'NUM_LENGTH'
};

function SaveParameters() {
	var param;

	param = document.getElementById( ElmNames.dirPath ).value;
	localStorage.setItem( 'ISP:' + ElmNames.dirPath, param );

	param = document.getElementById( ElmNames.imgHead ).value;
	localStorage.setItem( 'ISP:' + ElmNames.imgHead, param );

	param = document.getElementById( ElmNames.imgTail ).value;
	localStorage.setItem( 'ISP:' + ElmNames.imgTail, param );

	param = document.getElementById( ElmNames.numCur ).value;
	localStorage.setItem( 'ISP:' + ElmNames.numCur, param );

	param = document.getElementById( ElmNames.numStart ).value;
	localStorage.setItem( 'ISP:' + ElmNames.numStart, param );

	param = document.getElementById( ElmNames.fps ).value;
	localStorage.setItem( 'ISP:' + ElmNames.fps, param );

	param = document.getElementById( ElmNames.numLen ).value;
	localStorage.setItem( 'ISP:' + ElmNames.numLen, param );

}

function LoadParameters() {

	var param;

	try {

		param = localStorage.getItem( 'ISP:' + ElmNames.dirPath );
		if ( param ) { document.getElementById( ElmNames.dirPath ).value = param; }	

		param = localStorage.getItem( 'ISP:' + ElmNames.imgHead );
		if ( param ) { document.getElementById( ElmNames.imgHead ).value = param; }	

		param = localStorage.getItem( 'ISP:' + ElmNames.imgTail );
		if ( param ) { document.getElementById( ElmNames.imgTail ).value = param; }	

		param = localStorage.getItem( 'ISP:' + ElmNames.numStart );
		if ( param ) { document.getElementById( ElmNames.numCur ).value = param; }	

		param = localStorage.getItem( 'ISP:' + ElmNames.numCur );
		if ( param ) { document.getElementById( ElmNames.numCur ).value = param; }	

		param = localStorage.getItem( 'ISP:' + ElmNames.fps );
		if ( param ) { document.getElementById( ElmNames.fps ).value = param; }	

		param = localStorage.getItem( 'ISP:' + ElmNames.numLen );
		if ( param ) { document.getElementById( ElmNames.numLen ).value = param; }	

	} catch( e ) {

	}


}

function RewTopImgSeqPlayer() {
	ImgSeqPlayer.rewTop();
}

function PlayImgSeqPlayer() {
	SaveParameters();
	ImgSeqPlayer.stop();
	ImgSeqPlayer.play();
}

function RewPlayImgSeqPlayer() {
	SaveParameters();
	ImgSeqPlayer.stop();
	ImgSeqPlayer.rewPlay();
}

function StopImgSeqPlayer() {
	ImgSeqPlayer.stop();
}


function ToolsInitialize() {

	LoadParameters();

	ImgSeqPlayer = new ImageSequencePlayer( ElmNames );

	document.getElementById( 'PLAY_TOP'   ).onclick = RewTopImgSeqPlayer;
	document.getElementById( 'PLAY_START' ).onclick = PlayImgSeqPlayer;
	document.getElementById( 'REW_PLAY_START' ).onclick = RewPlayImgSeqPlayer;
	document.getElementById( 'PLAY_STOP'  ).onclick = StopImgSeqPlayer;

}

function ToolsExit() {
	SaveParameters();
}

