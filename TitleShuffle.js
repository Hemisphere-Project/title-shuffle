var TitleShuffle = {
	transitionLength:500,
	lastProgress:0,
	titleList:[],
	tA:{},
	tB:{},
	init:function(){
		var sectionsList = document.getElementsByClassName("mx-section");
		for(var k= 0; k < sectionsList.length;k++){
			var pos = getAnchorPosition(sectionsList[k].id);
			this.titleList.push({title:sectionsList[k].id,position:pos});
			console.log(k+"  "+JSON.stringify(pos));
		}
		
		//this.tA = this.titleList[0];
		//this.tB = this.titleList[1];
		this.onScroll();
		
		
		window.addEventListener("optimizedScroll", this.onScroll);
	},
	mixTitles:function(progress){
		var tAChars = this.tA.title.split("");
		var tBChars = this.tB.title.split("");
		
		var tATargetLength = Math.floor((1-progress)*tAChars.length);
		var tBTargetLength = Math.floor(progress*tBChars.length);
		
		// splice some character in the A string array
		while(tAChars.length > tATargetLength){
			var randIndex = Math.floor(Math.random()*tAChars.length);
			tAChars.splice(randIndex,1);
		}
		
		// splice some character in the B string array
		while(tBChars.length > tBTargetLength){
			var randIndex = Math.floor(Math.random()*tBChars.length);
			tBChars.splice(randIndex,1);
		}
		
		// mix A and B strings
		var mix = [];
		var k = 0;
		while(k<tAChars.length || k<tBChars.length){
			if(k < tAChars.length)
				mix.push(tAChars[k]);
			if(k < tBChars.length)
				mix.push(tBChars[k]);
			k++;
		}
		
		//console.log(mix);
		document.getElementsByClassName("mx-title")[0].innerHTML = mix.join("");
	},
	updateAB:function(screenpos){
		//console.log(screenpos);
		
		if(screenpos < this.titleList[0].position.y){ //before the first anchor
			this.tA = this.titleList[0];
			this.tB = this.titleList[0];
		}else if(screenpos >= this.titleList[0].position.y && screenpos < this.titleList[this.titleList.length-1].position.y){
			var k = 0;
			while(k<this.titleList.length && screenpos >= this.titleList[k].position.y) /// PB d'algo ici !!!!
				k++;
			if(k<this.titleList.length){
				this.tA = this.titleList[k-1];
				this.tB = this.titleList[k];	
			}
		}else if(screenpos >= this.titleList[this.titleList.length-1].position.y){ // after the last anchor
			this.tA = this.titleList[this.titleList.length-1];
			this.tB = this.titleList[this.titleList.length-1];
		}
		
		//console.log(this.tA.title);
		//console.log(this.tB.title);	
	},
	onScroll:function(event){
		//console.log("scroll baby"+event);
		var content = document.getElementsByClassName("mx-content")[0];
		var screenPosition = content.getBoundingClientRect();
		
		//var progress = -screenPosition.top%1000 / 100;
		//progress = Math.round(progress);
		//progress /=10;
		
		var screenpos = -screenPosition.top;
		TitleShuffle.updateAB(screenpos);
		if( screenpos >= TitleShuffle.tB.position.y - TitleShuffle.transitionLength && screenpos >= TitleShuffle.titleList[0].position.y && screenpos < TitleShuffle.titleList[TitleShuffle.titleList.length-1].position.y){
			var progress = ( screenpos - TitleShuffle.tB.position.y + TitleShuffle.transitionLength) / TitleShuffle.transitionLength;
			progress = Math.round(progress*100)/100;
			console.log(progress);
			if(progress != TitleShuffle.lastProgress)
				TitleShuffle.mixTitles(progress);
			TitleShuffle.lastProgress = progress;
		
		}else
			document.getElementsByClassName("mx-title")[0].innerHTML = TitleShuffle.tA.title;
	}
	
	
	
	
}

;(function() {
    var throttle = function(type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle ("scroll", "optimizedScroll");
})();
