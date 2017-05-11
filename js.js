(function() {
    "use strict";
    var Sequencer = function() {
        if (Sequencer.instance) {
            return Sequencer.instance;
        }
        Sequencer.instance = this;
        this.bpm = parseInt($('.sequencer__input--bpm input').val());
        this.hpb = 8;
        this.beat = 0;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.player;
        this.playing = false;
        this.sounds = [
            {
                element : 'kick',
                fileLocation : 'sounds/DBD_KICK2.wav',
                buffer : null,
                volume : 0.5,
                detune : 0,
                speed : 1
            },
            {
                element : 'snare',
                fileLocation : 'sounds/DBD_SNARE11.wav',
                buffer : null,
                volume : 0.5,
                detune : 0,
                speed : 1
            },
            {
                element : 'hat',
                fileLocation : 'sounds/DBD_HIHAT9.wav',
                buffer : null,
                volume : 0.5,
                detune : 0,
                speed : 1
            },
            {
                element : 'hat2',
                fileLocation : 'sounds/DBD_HIHAT8.wav',
                buffer : null,
                volume : 0.5,
                detune : 0,
                speed : 1
            },
            {
                element : 'hat2',
                fileLocation : 'sounds/chillout/Keys/Trumporgan/Notes/Trumporgan 01 A.wav',
                buffer : null,
                volume : 0.5,
                detune : 0,
                speed : 1
            },
            {
                element : 'hat2',
                fileLocation : 'sounds/chillout/Keys/Trumporgan/Notes/Trumporgan 01 B.wav',
                buffer : null,
                volume : 0.5,
                detune : 0,
                speed : 1
            },
            {
                element : 'hat2',
                fileLocation : 'sounds/chillout/Keys/Trumporgan/Notes/Trumporgan 01 C.wav',
                buffer : null,
                volume : 0.5,
                detune : 0,
                speed : 1
            },
            {
                element : 'hat2',
                fileLocation : 'sounds/chillout/Keys/Trumporgan/Notes/Trumporgan 01 D.wav',
                buffer : null,
                volume : 0.5,
                detune : 0,
                speed : 1
            },
        ]
        this.oscillators = [];
        this.notes = [
	        {
	        	note : "c",
	        	freq : 65,
	        	on : true
	        },
	        {
	        	note : "c",
	        	freq : 73,
	        	on : true
	        },
	        {
	        	note : "c",
	        	freq : 82,
	        	on : true
	        },
	        {
	        	note : "c",
	        	freq : 87,
	        	on : true
	        },
	        {
	        	note : "c",
	        	freq : 89,
	        	on : true
	        },
	        {
	        	note : "c",
	        	freq : 110,
	        	on : true
	        },
	        {
	        	note : "c",
	        	freq : 124,
	        	on : true
	        },
	        {
	        	note : "c",
	        	freq : 131,
	        	on : true
	        },

        ];
        this.init();
    };
    window.Sequencer = Sequencer;
    Sequencer.prototype = {
        init: function() {
            this.getSounds();
            this.startOscillators();
            this.bindListeners();
        },
        playSounds: function(){
            var sequencer = this;
            for(var i = 0; i<$('.sequencer__row').length; i++){
                if($('.sequencer__block').eq(sequencer.beat+(i*sequencer.hpb*4)).hasClass('is-active')){
                    sequencer.playBuffer(sequencer.sounds[i].buffer, sequencer.sounds[i].volume, sequencer.sounds[i].detune, sequencer.sounds[i].speed);
                }
            }
            sequencer.showPosition();
            this.beat++;
            if(this.beat >= sequencer.hpb * 4){
                this.beat = 0;
            }

        },
        bindListeners: function(){
            var sequencer = this;
            $('.sequencer__row').on('click', '.sequencer__block' , function(){
                $(this).toggleClass('is-active');
            })
            $('.sequencer__row').on('change', '.input--volume', function(){
                var i = $('.input--volume').index($(this));
                sequencer.sounds[i].volume = parseFloat($('.input--volume').eq(i).val());
            })
            $('.sequencer__row').on('change', '.input--rate', function(){
                var i = $('.input--rate').index($(this));
                sequencer.sounds[i].speed = parseFloat($('.input--rate').eq(i).val());
            })
            $('.sequencer__row').on('change', '.input--detune', function(){
                var i = $('.input--detune').index($(this));
                sequencer.sounds[i].detune = parseFloat($('.input--detune').eq(i).val());
            })
            $('.sequencer__input--hpb input').on('change',function(){
                sequencer.stop();
                sequencer.generateSequencerBlocks();
            })
            $('.sequencer__input--bpm input').on('change', function(){
                sequencer.bpm = parseInt($('.sequencer__input--bpm input').val());
                sequencer.stop();
            })
            $('.btn.btn--start').on('click', function(){
                sequencer.start();
            })
            $('.btn.btn--stop').on('click', function(){
                sequencer.stop();
            })
            $('.btn--clear').on('click', function(){
                sequencer.clearAll();
            })
            $('.btn--data').on('click', function(){
                sequencer.generateSongData();
            })
            $('.btn--load').on('click', function(){
                sequencer.loadSongFromData();
            })
            window.addEventListener("keydown", function (event) {
				  if (event.defaultPrevented) {
				    return;
				  }
				  switch (event.key) {
				    case "q":
				      sequencer.notes[0].on = true;
				      sequencer.oscillate(0,sequencer.notes[0].on);
				      break;
				    case "w":
				      sequencer.notes[1].on = true;
				      sequencer.oscillate(1,sequencer.notes[1].on);
				      break;
				    case "e":
				      sequencer.notes[2].on = true;
				      sequencer.oscillate(2,sequencer.notes[2].on);
				      break;
				    case "r":
				      sequencer.notes[3].on = true;
				      sequencer.oscillate(3,sequencer.notes[3].on);
				      break;
				    case "t":
				      sequencer.notes[4].on = true;
				      sequencer.oscillate(4,sequencer.notes[4].on);
				      break;
				    case "y":
				      sequencer.notes[5].on = true;
				      sequencer.oscillate(5,sequencer.notes[5].on);
				      break;
				    case "u":
				      sequencer.notes[6].on = true;
				      sequencer.oscillate(6,sequencer.notes[6].on);
				      break;
				    case "i":
				      sequencer.notes[7].on = true;
				      sequencer.oscillate(7,sequencer.notes[7].on);
				      break;
				    default:
				      return;
				  }
				  event.preventDefault();
				}, true);
            window.addEventListener("keyup", function (event) {
				  if (event.defaultPrevented) {
				    return;
				  }
				  switch (event.key) {
				    case "q":
				      sequencer.notes[0].on = false;
				      sequencer.oscillate(0,sequencer.notes[0].on);
				      break;
				    case "w":
				      sequencer.notes[1].on = false;
				      sequencer.oscillate(1,sequencer.notes[1].on);
				      break;
				    case "e":
				      sequencer.notes[2].on = false;
				      sequencer.oscillate(2,sequencer.notes[2].on);
				      break;
				    case "r":
				      sequencer.notes[3].on = false;
				      sequencer.oscillate(3,sequencer.notes[3].on);
				      break;
				    case "t":
				      sequencer.notes[4].on = false;
				      sequencer.oscillate(4,sequencer.notes[4].on);
				      break;
				    case "y":
				      sequencer.notes[5].on = false;
				      sequencer.oscillate(5,sequencer.notes[5].on);
				      break;
				    case "u":
				      sequencer.notes[6].on = false;
				      sequencer.oscillate(6,sequencer.notes[6].on);
				      break;
				    case "i":
				      sequencer.notes[7].on = false;
				      sequencer.oscillate(7,sequencer.notes[7].on);
				      break;
				    default:
				      return;
				  }
				  event.preventDefault();
				}, true);
        },
        getSounds : function(){
            var sequencer = this;
            sequencer.sounds.forEach(function(sound){
                var req = new XMLHttpRequest();
                req.open("GET", sound.fileLocation, true);
                req.responseType = "arraybuffer";
                req.onload = function() {
                    sequencer.audioCtx.decodeAudioData(req.response, function(buffer){
                        sound.buffer = buffer;
                    });
                }
                req.send();
            })
            sequencer.generateSequencerBlocks();
        },
        playBuffer : function(buffer, volume, detune, playbackrate){
            var sequencer = this;
            var gainNode = sequencer.audioCtx.createGain();
            var source = sequencer.audioCtx.createBufferSource();
            source.buffer = buffer;
            source.detune.value = detune;
            source.playbackRate.value = playbackrate;
            source.connect(gainNode);
            gainNode.connect(sequencer.audioCtx.destination);
            gainNode.gain.value = volume;

            //source.connect(sequencer.audioCtx.destination);
            source.start();
        },
        start : function(){
            var sequencer = this;
            if(!sequencer.playing){
                sequencer.player = setInterval(function() {
                    $('.sequencer__display--beat').text(sequencer.beat+1);
                    sequencer.playSounds();
                }, 60000/(sequencer.bpm*sequencer.hpb)*2);
                sequencer.playing = true;
            }   
        },
        stop : function(){
            var sequencer = this;
            if(this.playing){
                clearInterval(this.player);
                this.playing = false;
                this.beat = 0;
                $('.sequencer__display--beat').text(sequencer.beat+1)
            }
            $('.sequencer__block').removeClass('is-playing');
        },
        pause : function(){
            if(this.playing){
                clearInterval(this.player);
                this.playing = false;
            }
        },
        generateSequencerBlocks : function(){
            var sequencer = this;
            $('.sequencer__row').empty();
            for(var i = 0; i<sequencer.sounds.length;i++){
            	$('.sequencer__body').append('<div class="sequencer__row"></div>')
            }
            for(var i = 0; i<$('.sequencer__row').length;i++){
                $('.sequencer__row').eq(i).append('<p>'+sequencer.sounds[i].element+'</p>')
                $('.sequencer__row').eq(i).append('<input class="input--volume" type="range" value="0.5" max="1" min="0" step="0.05">');
                $('.sequencer__row').eq(i).append('<input class="input--detune" type="range" value="0" max="1200" min="-1200" step="100">');
                $('.sequencer__row').eq(i).append('<input class="input--rate" type="range" value="1" max="8" min="0" step="0.1">');
                for(var j = 0; j<sequencer.hpb*4;j++){
                    if(j%4 == 0 && j > 1){
                        $('.sequencer__row').eq(i).append('<div class="sequencer__divider"></div>');
                    }
                    $('.sequencer__row').eq(i).append('<div class="sequencer__block"></div>');                  
                }
            }
        },
        clearAll : function(){
            $('.sequencer__block').removeClass('is-active');
        },
        generateSongData : function(){
            var songData = [];
            for(var i = 0; i<$('.sequencer__row').length;i++){
                var songDataString = '';
                for(var j = 0; j<$('.sequencer__row').eq(i).children('.sequencer__block').length;j++){
                    if($('.sequencer__row').eq(i).children('.sequencer__block').eq(j).hasClass('is-active')){
                        songDataString += "1";
                    }else{
                        songDataString += "0";
                    }
                    console.log(songDataString);
                }
                songData[i] = songDataString;
            }
            console.log(songData);
            $('textarea').text(btoa(songData));
        },
        loadSongFromData : function(){
            var sequencer = this;
            sequencer.clearAll();
            var songString = $('textarea').val();
            songString = atob(songString);
            songString = songString.split(',');
            for(var i = 0; i<songString.length;i++){
                for(var j = 0; j<songString[i].length; j++){
                    if(songString[i][j] == "1"){
                        $('.sequencer__row').eq(i).children('.sequencer__block').eq(j).addClass('is-active');
                    }     
                }
            }
        },
        showPosition : function(){
        	var sequencer = this;

        	for(var i = 0; i<$('.sequencer__row').length; i++){
        		$('.sequencer__block').eq(sequencer.beat-2+(i*sequencer.hpb*4)).removeClass('is-playing');
                $('.sequencer__block').eq(sequencer.beat+(i*sequencer.hpb*4)).toggleClass('is-playing');
            }
        },
        startOscillators : function(){
        	var sequencer = this;
        	for(var i = 0; i<sequencer.notes.length; i++){
        		sequencer.oscillators[i] = sequencer.audioCtx.createOscillator();
        		sequencer.oscillators[i].type = 'triangle';
        		sequencer.oscillators[i].frequency.value = sequencer.notes[i].freq;
        		sequencer.oscillators[i].gainNode = sequencer.audioCtx.createGain();
        		sequencer.oscillators[i].connect(sequencer.oscillators[i].gainNode);
        		sequencer.oscillators[i].gainNode.gain.value = 0.4;
        		sequencer.oscillators[i].start();
        	}
        },
        oscillate : function(note, on){
        	var sequencer = this;
        	if(on){
        		sequencer.oscillators[note].gainNode.connect(sequencer.audioCtx.destination);
        	}else{
        		sequencer.oscillators[note].gainNode.disconnect();
        	}
        }
    }
    window.onload = function() {
        var app = new Sequencer();
    };
})();
