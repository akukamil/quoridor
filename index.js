const M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}, state="",my_role="", LANG = 0, game_tick=0, my_turn=0,room_name='states', game_id=0, h_state=0, made_moves=0, game_platform="", hidden_state_start = 0, connected = 1;
var players="", pending_player="";
var my_data={opp_id : ''},opp_data={};
var some_process = {};
const V_WALL = 2, H_WALL = 1, ROW0 = 0, ROW8 = 8, MY_ID = 1, OPP_ID = 2, MAX_MOVES = 50, FIELD_MARGIN = 20;
const WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;

irnd = function (min,max) {	
	//мин и макс включительно
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rgb_to_hex = (r, g, b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = "single";
		this.x=x;
		this.y=y;
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){cards_menu.card_down(id)};
		this.bcg.pointerover=function(){this.bcg.alpha=0.5;}.bind(this);
		this.bcg.pointerout=function(){this.bcg.alpha=1;}.bind(this);
		this.bcg.width=200;
		this.bcg.height=100;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=20;
		this.avatar.width=this.avatar.height=60;

		this.name="";
		this.name_text=new PIXI.BitmapText('...', {fontName: 'mfont',fontSize: 25});
		this.name_text.anchor.set(0.5,0.5);
		this.name_text.x=135;
		this.name_text.y=35;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('...', {fontName: 'mfont',fontSize: 28});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(0.5,0.5);
		this.rating_text.x=135;
		this.rating_text.y=70;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=20;
		this.avatar1.y=20;
		this.avatar1.width=this.avatar1.height=60;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=120;
		this.avatar2.y=20;
		this.avatar2.width=this.avatar2.height=60;

		this.rating_text1=new PIXI.BitmapText('1400', {fontName: 'mfont',fontSize: 22});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=50;
		this.rating_text1.y=70;

		this.rating_text2=new PIXI.BitmapText('1400', {fontName: 'mfont',fontSize: 22});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150;
		this.rating_text2.y=70;
		
		//
		this.rating_bcg = new PIXI.Sprite(game_res.resources.rating_bcg.texture);
		this.rating_bcg.width=200;
		this.rating_bcg.height=100;
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2, this.rating_bcg, this.rating_text,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};


		this.place=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 25});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.rating.x=298;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class chat_record_class extends PIXI.Container {
	
	constructor() {
		
		super();
		
		this.tm=0;
		this.msg_id=0;
		this.msg_index=0;
		
		
		this.msg_bcg = new PIXI.Sprite(gres.msg_bcg.texture);
		this.msg_bcg.width=560;
		this.msg_bcg.height=75;
		this.msg_bcg.x=90;
		//this.msg_bcg.tint=Math.random() * 0xffffff;
		

		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 15});
		this.name.anchor.set(0.5,0.5);
		this.name.x=65;
		this.name.y=55;
		
		
		this.avatar = new PIXI.Sprite(PIXI.Texture.WHITE);
		this.avatar.width = this.avatar.height = 40;
		this.avatar.x=65;
		this.avatar.y=5;
		this.avatar.interactive=true;
		this.avatar.pointerdown=feedback.response_message.bind(this,this);
		this.avatar.anchor.set(0.5,0)
				
		
		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 20,align: 'left'}); 
		this.msg.x=140;
		this.msg.y=37.5;
		this.msg.maxWidth=400;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0x333333;
		
		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'mfont',fontSize: 14}); 
		this.msg_tm.y=57;
		this.msg_tm.tint=0x000000;
		this.msg_tm.alpha=0.5;
		this.msg_tm.anchor.set(1,0.5);
		
		this.visible = false;
		this.addChild(this.msg_bcg,this.avatar, this.name, this.msg,this.msg_tm);
		
	}
	
	async update_avatar(uid, tar_sprite) {
		
		
		let pic_url = '';
		//если есть в кэше то =берем оттуда если нет то загружаем
		if (cards_menu.uid_pic_url_cache[uid] !== undefined) {
			
			pic_url = cards_menu.uid_pic_url_cache[uid];
			
		} else {
			
			pic_url = await firebase.database().ref("players/" + uid + "/pic_url").once('value');		
			pic_url = pic_url.val();			
			cards_menu.uid_pic_url_cache[uid] = pic_url;
		}
		
		
		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//загружаем аватарку игрока
			let loader=new PIXI.Loader();
			loader.add("pic", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 3000});
			
			let texture = await new Promise((resolve, reject) => {				
				loader.load(function(l,r) {	resolve(l.resources.pic.texture)});
			})
			
			if (texture === undefined || texture.width === 1) {
				texture = PIXI.Texture.WHITE;
				texture.tint = this.msg.tint;
			}
			
			tar_sprite.texture = texture;
			
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log(`Текстура взята из кэша ${pic_url}`)	
			tar_sprite.texture =  PIXI.utils.TextureCache[pic_url];
		}
		
	}
	
	async set(msg_data) {
						
		//получаем pic_url из фб
		this.avatar.texture=PIXI.Texture.WHITE;
		await this.update_avatar(msg_data.uid, this.avatar);



		this.tm = msg_data.tm;
			
		this.msg_id = msg_data.msg_id;
		this.msg_index=msg_data.msg_index;
		
		if (msg_data.name.length > 15) msg_data.name = msg_data.name.substring(0, 15);	
		this.name.text=msg_data.name ;		
		
		this.msg.text=msg_data.msg;
		
		if (msg_data.msg.length<25) {
			this.msg_bcg.texture = gres.msg_bcg_short.texture;			
			this.msg_tm.x=400;
		}
		else {
			
			this.msg_bcg.texture = gres.msg_bcg.texture;	
			this.msg_tm.x=630;
		}

		
		this.visible = true;
		
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		
	}	
	
}

class node_class {
		
	constructor(field, player_id, depth) {
		
		this.field = JSON.parse(JSON.stringify(field));
		this.visited = 0;
		this.depth = depth;
		this.player_id = player_id;
		this.childs = [];
		this.parent = null;	
		this.move_data = {};
		
	}
	
	add_childs(save_move_data) {		
		
		let player_to_move = 3 - this.player_id;
		
		//добаляем ноды с ходами
		let moves = ffunc.get_moves(this.field, player_to_move);		
		for (let i = 0 ; i < moves.length; i++) {
			
			let node = new node_class(this.field, player_to_move, this.depth + 1);			
			ffunc.make_move(node.field, moves[i].r0, moves[i].c0, moves[i].r1, moves[i].c1);
			if (save_move_data === 1)
				node.move_data = JSON.parse(JSON.stringify(moves[i]));	
			this.childs.push(node);
		}		
		
		//добавляем стены только которые рядом
		if (this.field.pos[player_to_move].walls === 0)
			return;
		
		//теукщее положение игрока
		let pr = this.field.pos[this.player_id].r;
		let pc = this.field.pos[this.player_id].c;
		
		let walls_pos = [[1,-1],[0,-1],[2,0],[1,0],[0,0],[-1,0],[2,1],[1,1],[0,1],[-1,1],[1,2],[0,2]]
		
		for (let p of walls_pos ) {
				
				let r = pr + p[0];
				let c = pc + p[1];
				
				if (r < 1 || r > 8 || c < 1 || c > 8)
					continue
				
				if (ffunc.check_new_wall(this.field, r, c, V_WALL) === 1 &&
					ffunc.check_if_wall_block (this.field, r, c, V_WALL)===0) {	
					
					let node = new node_class(this.field, player_to_move, this.depth + 1);	
					if (save_move_data === 1)
						node.move_data = {type : 'wall', r : r, c : c, wall_type : V_WALL};	
					node.field.f[r][c].wall_type = V_WALL;
					this.childs.push(node);
				}
				
				if (ffunc.check_new_wall(game.field, r, c, H_WALL) === 1 &&
					ffunc.check_if_wall_block (game.field, r, c, H_WALL)===0) {	
					
					let node = new node_class(this.field, player_to_move, this.depth + 1);	
					if (save_move_data === 1)
						node.move_data = {type : 'wall', r : r, c : c, wall_type : H_WALL};	
					node.field.f[r][c].wall_type = H_WALL;	
					this.childs.push(node);
				}		
		}	
	}

	add_childs_only_moves(save_move_data) {		
		
		let player_to_move = 3 - this.player_id;
		
		//добаляем ноды с ходами
		let moves = ffunc.get_moves(this.field, player_to_move);		
		for (let i = 0 ; i < moves.length; i++) {
			
			let node = new node_class(this.field, player_to_move, this.depth + 1);			
			ffunc.make_move(node.field, moves[i].r0, moves[i].c0, moves[i].r1, moves[i].c1);
			if (save_move_data === 1)
				node.move_data = JSON.parse(JSON.stringify(moves[i]));	
			node.parent = this;
			this.childs.push(node);
		}		

	}
	
	add_childs_only_walls(save_move_data) {		
		
		let player_to_move = 3 - this.player_id;
		
		
		//добавляем стены только которые рядом
		if (this.field.pos[player_to_move].walls === 0) {
			this.add_childs_only_moves(save_move_data);
			return;			
		}

		
		//теукщее положение именно оппонента
		let pr = this.field.pos[this.player_id].r;
		let pc = this.field.pos[this.player_id].c;
		
		let walls_pos = [[1,-1],[0,-1],[2,0],[1,0],[0,0],[-1,0],[2,1],[1,1],[0,1],[-1,1],[1,2],[0,2]]
		
		for (let p of walls_pos ) {
				
			let r = pr + p[0];
			let c = pc + p[1];
			
			if (r < 1 || r > 8 || c < 1 || c > 8)
				continue
			
			if (ffunc.check_new_wall(this.field, r, c, V_WALL) === 1 &&
				ffunc.check_if_wall_block (this.field, r, c, V_WALL)===0) {	
				
				let node = new node_class(this.field, player_to_move, this.depth + 1);	
				if (save_move_data === 1)
					node.move_data = {type : 'wall', r : r, c : c, wall_type : V_WALL};	
				node.field.f[r][c].wall_type = V_WALL;
				this.childs.push(node);
			}
			
			if (ffunc.check_new_wall(game.field, r, c, H_WALL) === 1 &&
				ffunc.check_if_wall_block (game.field, r, c, H_WALL)===0) {	
				
				let node = new node_class(this.field, player_to_move, this.depth + 1);	
				if (save_move_data === 1)
					node.move_data = {type : 'wall', r : r, c : c, wall_type : H_WALL};	
				node.field.f[r][c].wall_type = H_WALL;	
				this.childs.push(node);
			}		
		}	
		
		//если нету детей то возвращаем ходами
		if (this.childs.length === 0)
			this.add_childs_only_moves(save_move_data);
		
	}
	
}

sound = {
	
	on : 1,
	
	play : function(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	}
	
	
}

feedback = {
		
	rus_keys : [[50,176,80,215.07,'1'],[90,176,120,215.07,'2'],[130,176,160,215.07,'3'],[170,176,200,215.07,'4'],[210,176,240,215.07,'5'],[250,176,280,215.07,'6'],[290,176,320,215.07,'7'],[330,176,360,215.07,'8'],[370,176,400,215.07,'9'],[410,176,440,215.07,'0'],[491,176,541,215.07,'<'],[70,224.9,100,263.97,'Й'],[110,224.9,140,263.97,'Ц'],[150,224.9,180,263.97,'У'],[190,224.9,220,263.97,'К'],[230,224.9,260,263.97,'Е'],[270,224.9,300,263.97,'Н'],[310,224.9,340,263.97,'Г'],[350,224.9,380,263.97,'Ш'],[390,224.9,420,263.97,'Щ'],[430,224.9,460,263.97,'З'],[470,224.9,500,263.97,'Х'],[510,224.9,540,263.97,'Ъ'],[90,273.7,120,312.77,'Ф'],[130,273.7,160,312.77,'Ы'],[170,273.7,200,312.77,'В'],[210,273.7,240,312.77,'А'],[250,273.7,280,312.77,'П'],[290,273.7,320,312.77,'Р'],[330,273.7,360,312.77,'О'],[370,273.7,400,312.77,'Л'],[410,273.7,440,312.77,'Д'],[450,273.7,480,312.77,'Ж'],[490,273.7,520,312.77,'Э'],[70,322.6,100,361.67,'!'],[110,322.6,140,361.67,'Я'],[150,322.6,180,361.67,'Ч'],[190,322.6,220,361.67,'С'],[230,322.6,260,361.67,'М'],[270,322.6,300,361.67,'И'],[310,322.6,340,361.67,'Т'],[350,322.6,380,361.67,'Ь'],[390,322.6,420,361.67,'Б'],[430,322.6,460,361.67,'Ю'],[511,322.6,541,361.67,')'],[451,176,481,215.07,'?'],[30,371.4,180,410.47,'ЗАКРЫТЬ'],[190,371.4,420,410.47,'_'],[430,371.4,570,410.47,'ОТПРАВИТЬ'],[531,273.7,561,312.77,','],[471,322.6,501,361.67,'('],[30,273.7,80,312.77,'EN']],	
	eng_keys : [[50,176,80,215.07,'1'],[90,176,120,215.07,'2'],[130,176,160,215.07,'3'],[170,176,200,215.07,'4'],[210,176,240,215.07,'5'],[250,176,280,215.07,'6'],[290,176,320,215.07,'7'],[330,176,360,215.07,'8'],[370,176,400,215.07,'9'],[410,176,440,215.07,'0'],[491,176,541,215.07,'<'],[110,224.9,140,263.97,'Q'],[150,224.9,180,263.97,'W'],[190,224.9,220,263.97,'E'],[230,224.9,260,263.97,'R'],[270,224.9,300,263.97,'T'],[310,224.9,340,263.97,'Y'],[350,224.9,380,263.97,'U'],[390,224.9,420,263.97,'I'],[430,224.9,460,263.97,'O'],[470,224.9,500,263.97,'P'],[130,273.7,160,312.77,'A'],[170,273.7,200,312.77,'S'],[210,273.7,240,312.77,'D'],[250,273.7,280,312.77,'F'],[290,273.7,320,312.77,'G'],[330,273.7,360,312.77,'H'],[370,273.7,400,312.77,'J'],[410,273.7,440,312.77,'K'],[450,273.7,480,312.77,'L'],[471,322.6,501,361.67,'('],[70,322.6,100,361.67,'!'],[150,322.6,180,361.67,'Z'],[190,322.6,220,361.67,'X'],[230,322.6,260,361.67,'C'],[270,322.6,300,361.67,'V'],[310,322.6,340,361.67,'B'],[350,322.6,380,361.67,'N'],[390,322.6,420,361.67,'M'],[511,322.6,541,361.67,')'],[451,176,481,215.07,'?'],[30,371.4,180,410.47,'CLOSE'],[190,371.4,420,410.47,'_'],[430,371.4,570,410.47,'SEND'],[531,273.7,561,312.77,','],[30,273.7,80,312.77,'RU']],
	keyboard_layout : [],
	lang : '',
	p_resolve : 0,
	MAX_SYMBOLS : 50,
	uid:0,
	en_stop_list:['2 girls 1 cup','2g1c','4r5e','5h1t','5hit','a_s_s','a55','a55hole','acrotomophilia','aeolus','ahole','alabama hot pocket','alaskan pipeline','anal','analprobe','anilingus','anus','apeshit','ar5e','areola','areole','arian','arrse','arse','arsehole','aryan','ass','ass hole','assbag','assbandit','assbang','assbanged','assbanger','assbangs','assbite','assclown','asscock','asscracker','asses','assface','assfuck','assfucker','ass-fucker','assfukka','assgoblin','assh0le','asshat','ass-hat','asshead','assho1e','asshole','assholes','asshopper','ass-jabber','assjacker','asslick','asslicker','assmaster','assmonkey','assmunch','assmuncher','assnigger','asspirate','ass-pirate','assshit','assshole','asssucker','asswad','asswhole','asswipe','asswipes','auto erotic','autoerotic','axwound','azazel','azz','b!tch','b00bs','b17ch','b1tch','babe','babeland','babes','baby batter','baby juice','balls','ball gag','ball gravy','ball kicking','ball licking','ball sack','ball sucking','ballbag','ballsack','bampot','bang','bangbros','banger','bareback','barely legal','barenaked','barf','bastard','bastardo','bastards','bastinado','bawdy','bbw','bdsm','beaner','beaners','beardedclam','beastial','beastiality','beatch','beater','beaver cleaver','beaver lips','beeyotch','bellend','beotch','bestial','bestiality','bi+ch','biatch','big black','big breasts','big knockers','big tits','bigtits','bimbo','bimbos','birdlock','bitch','bitchass','bitched','bitcher','bitchers','bitches','bitchin','bitching','bitchtits','bitchy','black cock','blonde action','blonde on blonde action','blow job','blow your load','blowjob','blowjobs','blue waffle','blumpkin','bod','bodily','boink','boiolas','bollock','bollocks','bollok','bollox','bondage','boned','boner','boners','bong','boob','boobies','boobs','booby','booger','bookie','booobs','boooobs','booooobs','booooooobs','bootee','bootie','booty','booty call','booze','boozer','boozy','bosom','bosomy','bra','brassiere','breast','breasts','breeder','brotherfucker','brown showers','brunette action','buceta','bugger','bukkake','bull shit','bulldyke','bullet vibe','bullshit','bullshits','bullshitted','bullturds','bum','bumblefuck','bung','bung hole','bunghole','bunny fucker','busty','butt','butt fuck','butt plug','buttcheeks','buttfuck','buttfucka','buttfucker','butthole','buttmuch','butt-pirate','buttplug','c.0.c.k','c.o.c.k.','c.u.n.t','c0ck','c-0-c-k','c0cksucker','caca','cahone','camel toe','cameltoe','camgirl','camslut','camwhore','carpet muncher','carpetmuncher','cawk','cervix','chesticle','chinc','chincs','chink','choad','chocolate rosebuds','chode','chodes','cipa','circlejerk','cl1t','cleveland steamer','climax','clit','clitface','clitfuck','clitoris','clitorus','clits','clitty','clover clamps','clusterfuck','cnut','cocain','cocaine','cock','c-o-c-k','cock sucker','cockass','cockbite','cockblock','cockburger','cockeye','cockface','cockfucker','cockhead','cockholster','cockjockey','cockknocker','cockknoker','cocklump','cockmaster','cockmongler','cockmongruel','cockmonkey','cockmunch','cockmuncher','cocknose','cocknugget','cocks','cockshit','cocksmith','cocksmoke','cocksmoker','cocksniffer','cocksuck','cocksucked','cocksucker','cock-sucker','cocksucking','cocksucks','cocksuka','cocksukka','cockwaffle','coital','cok','cokmuncher','coksucka','commie','condom','coochie','coochy','coon','coons','cooter','coprolagnia','coprophilia','corksucker','cornhole','cox','crabs','crack','crackwhore','crap','crappy','creampie','crotte','cum','cumbubble','cumdumpster','cumguzzler','cumjockey','cummer','cummin','cumming','cums','cumshot','cumshots','cumslut','cumstain','cumtart','cunilingus','cunillingus','cunnie','cunnilingus','cunny','cunt','c-u-n-t','cuntass','cuntface','cunthole','cunthunter','cuntlick','cuntlicker','cuntlicking','cuntrag','cunts','cuntslut','cyalis','cyberfuc','cyberfuck','cyberfucked','cyberfucker','cyberfuckers','cyberfucking','d0ng','d0uch3','d0uche','d1ck','d1ld0','d1ldo','dago','dagos','darkie','damn','damned','dammit','date rape','daterape','dawgie-style','deep throat','deepthroat','deggo','dendrophilia','dick','dickbag','dickbeaters','dickdipper','dickface','dickflipper','dickfuck','dickfucker','dickhead','dickheads','dickhole','dickish','dick-ish','dickjuice','dickmilk ','dickmonger','dickripper','dicks','dicksipper','dickslap','dick-sneeze','dicksucker','dicksucking','dicktickler','dickwad','dickweasel','dickweed','dickwhipper','dickwod','dickzipper','diddle','dike','dildo','dildos','diligaf','dillweed','dimwit','dingle','dingleberries','dingleberry','dink','dinks','dipship','dipshit','dirsa','dirty pillows','dirty sanchez','dlck','dog style','dog-fucker','doggie style','doggiestyle','doggie-style','doggin','dogging','doggy style','doggystyle','doggy-style','dolcett','domination','dominatrix','dommes','dong','donkey punch','donkeyribber','doochbag','doofus','dookie','doosh','dopey','double dong','double penetration','doublelift','douch3','douche','douchebag','douchebags','douche-fag','douchewaffle','douchey','dp action','drunk','dry hump','duche','dumass','dumb ass','dumbass','dumbasses','dumbcunt','dumbfuck','dumbshit','dummy','dumshit','dvda','dyke','dykes','eat my ass','ecchi','ejaculate','ejaculated','ejaculates','ejaculating','ejaculatings','ejaculation','ejakulate','enlargement','erect','erection','erotic','erotism','escort','essohbee','eunuch','extacy','extasy','f u c k','f u c k e r','f.u.c.k','f_u_c_k','f4nny','fack','fag','fagbag','fagfucker','fagg','fagged','fagging','faggit','faggitt','faggot','faggotcock','faggs','fagot','fagots','fags','fagtard','faig','faigt','fanny','fannybandit','fannyflaps','fannyfucker','fanyy','fartknocker','fatass','fcuk','fcuker','fcuking','fecal','feck','fecker','felch','felcher','felching','fellate','fellatio','feltch','feltcher','female squirting','femdom','figging','fingerbang','fingerfuck','fingerfucked','fingerfucker','fingerfuckers','fingerfucking','fingerfucks','fingering','fisted','fistfuck','fistfucked','fistfucker','fistfuckers','fistfucking','fistfuckings','fistfucks','fisting','fisty','flamer','flange','floozy','foad','foah','fondle','foobar','fook','fooker','foot fetish','footjob','foreskin','freex','frigg','frigga','frotting','fubar','fuck','f-u-c-k','fuck buttons','fuck off','fucka','fuckass','fuckbag','fuckboy','fuckbrain','fuckbutt','fuckbutter','fucked','fucker','fuckers','fuckersucker','fuckface','fuckhead','fuckheads','fuckhole','fuckin','fucking','fuckings','fuckingshitmotherfucker','fuckme','fucknugget','fucknut','fucknutt','fuckoff','fucks','fuckstick','fucktard','fuck-tard','fucktards','fucktart','fucktwat','fuckup','fuckwad','fuckwhit','fuckwit','fuckwitt','fudge packer','fudgepacker','fuk','fuker','fukker','fukkin','fuks','fukwhit','fukwit','futanari','fux','fux0r','fvck','fxck','gae','gai','gang bang','gangbang','gangbanged','gangbangs','ganja','gay','gay sex','gayass','gaybob','gaydo','gayfuck','gayfuckist','gaylord','gays','gaysex','gaytard','gaywad','genitals','gey','gfy','ghay','ghey','giant cock','gigolo','girl on','girl on top','girls gone wild','glans','goatcx','goatse','god damn','godamn','godamnit','goddam','god-dam','goddammit','goddamn','goddamned','god-damned','goddamnit','gokkun','golden shower','goldenshower','gonad','gonads','goo girl','gooch','goodpoop','gook','gooks','goregasm','gringo','grope','group sex','gspot','g-spot','gtfo','guido','guro','h0m0','h0mo','hand job','handjob','hard core','hard on','hardcore','hardcoresex','he11','heeb','hemp','hentai','heroin','herp','herpes','herpy','heshe','hitler','hiv','ho','hoar','hoare','hobag','hoe','hoer','hom0','homey','homo','homodumbshit','homoerotic','homoey','honkey','honky','hooch','hookah','hooker','hoor','hootch','hooter','hooters','hore','horniest','horny','hot carl','hot chick','hotsex','how to kill','how to murder','huge fat','hump','humped','humping','hussy','hymen','inbred','incest','injun','intercourse','j3rk0ff','jack Off','jackass','jackhole','jackoff','jack-off','jaggi','jagoff','jail bait','jailbait','jap','japs','jelly donut','jerk','jerk off','jerk0ff','jerkass','jerked','jerkoff','jerk-off','jigaboo','jiggaboo','jiggerboo','jism','jiz','jizm','jizz','jizzed','juggs','jungle bunny','junglebunny','junkie','junky','kawk','kike','kikes','kinbaku','kinkster','kinky','kkk','knob','knobbing','knobead','knobed','knobend','knobhead','knobjocky','knobjokey','kock','kondum','kondums','kooch','kooches','kootch','kraut','kum','kummer','kumming','kums','kunilingus','kunja','kunt','kyke','l3i+ch','l3itch','labia','lameass','lardass','leather restraint','leather straight jacket','lech','lemon party','leper','lesbian','lesbians','lesbo','lesbos','lez','lezbian','lezbians','lezbo','lezbos','lezzie','lezzies','lezzy','lmao','lmfao','loin','loins','lolita','lovemaking','lube','lust','lusting','lusty','m0f0','m0fo','m45terbate','ma5terb8','ma5terbate','make me come','male squirting','mams','masochist','massa','masterb8','masterbat','masterbat3','masterbate','master-bate','masterbating','masterbation','masterbations','masturbate','masturbating','masturbation','maxi','mcfagget','menage a trois','menses','menstruate','menstruation','meth','m-fucking','mick','milf','minge','missionary position','mof0','mofo','mo-fo','molest','moolie','moron','mothafuck','mothafucka','mothafuckas','mothafuckaz','mothafucked','mothafucker','mothafuckers','mothafuckin','mothafucking','mothafuckings','mothafucks','mother fucker','motherfuck','motherfucka','motherfucked','motherfucker','motherfuckers','motherfuckin','motherfucking','motherfuckings','motherfuckka','motherfucks','mound of venus','mr hands','mtherfucker','mthrfucker','mthrfucking','muff','muff diver','muffdiver','muffdiving','munging','murder','mutha','muthafecker','muthafuckaz','muthafucker','muthafuckker','muther','mutherfucker','mutherfucking','muthrfucking','n1gga','n1gger','nad','nads','naked','nambla','napalm','nappy','nawashi','nazi','nazism','negro','neonazi','nig nog','nigaboo','nigg3r','nigg4h','nigga','niggah','niggas','niggaz','nigger','niggers','niggle','niglet','nimphomania','nimrod','ninny','nipple','nipples','nob','nob jokey','nobhead','nobjocky','nobjokey','nooky','nsfw images','nude','nudity','numbnuts','nut sack','nutsack','nympho','nymphomania','octopussy','omorashi','one cup two girls','one guy one jar','opiate','opium','oral','orally','organ','orgasim','orgasims','orgasm','orgasmic','orgasms','orgies','orgy','ovary','ovum','ovums','p.u.s.s.y.','p0rn','paddy','paedophile','paki','panooch','pantie','panties','panty','pastie','pasty','pawn','pcp','pecker','peckerhead','pedo','pedobear','pedophile','pedophilia','pedophiliac','peepee','pegging','penetrate','penetration','penial','penile','penis','penisbanger','penisfucker','penispuffer','perversion','peyote','phalli','phallic','phone sex','phonesex','phuck','phuk','phuked','phuking','phukked','phukking','phuks','phuq','piece of shit','pigfucker','pillowbiter','pimp','pimpis','pinko','piss pig','pissed','pissed off','pisser','pissers','pisses','pissflaps','pissin','pissing','pissoff','piss-off','pisspig','playboy','pleasure chest','pms','polack','pole smoker','polesmoker','pollock','ponyplay','poof','poon','poonani','poonany','poontang','poop','poop chute','poopchute','poopuncher','porch monkey','porchmonkey','porn','porno','pornography','pornos','potty','prick','pricks','prig','prince albert piercing','pron','prostitute','prude','pthc','pube','pubes','pubic','pubis','punanny','punany','punkass','punky','punta','puss','pusse','pussi','pussies','pussy','pussylicking','pussypounder','pussys','pust','puto','queaf','queef','queer','queerbait','queerhole','queero','queers','quicky','quim','racy','raghead','raging boner','rape','raped','raper','raping','rapist','raunch','rectal','rectum','rectus','reefer','reetard','reich','renob','retard','retarded','reverse cowgirl','revue','rimjaw','rimjob','rimming','ritard','rosy palm','rosy palm and her 5 sisters','rtard','r-tard','rump','rumprammer','ruski','rusty trombone','s hit','s&m','s.h.i.t.','s.o.b.','s_h_i_t','s0b','sadism','sadist','sand nigger','sandler','sandnigger','sanger','santorum','scag','scantily','scat','schizo','schlong','scissoring','screw','screwed','screwing','scroat','scrog','scrot','scrote','scrotum','scrud','scum','seaman','seamen','seduce','seks','semen','sex','sexo','sexual','sexy','sh!+','sh!t','sh1t','s-h-1-t','shag','shagger','shaggin','shagging','shamedame','shaved beaver','shaved pussy','shemale','shi+','shibari','shit','s-h-i-t','shitass','shitbag','shitbagger','shitblimp','shitbrains','shitbreath','shitcanned','shitcunt','shitdick','shite','shiteater','shited','shitey','shitface','shitfaced','shitfuck','shitfull','shithead','shithole','shithouse','shiting','shitings','shits','shitspitter','shitstain','shitt','shitted','shitter','shitters','shittiest','shitting','shittings','shitty','shiz','shiznit','shota','shrimping','sissy','skag','skank','skeet','skullfuck','slag','slanteye','slave','sleaze','sleazy','slut','slutbag','slutdumper','slutkiss','sluts','smeg','smegma','smut','smutty','snatch','snowballing','snuff','s-o-b','sodom','sodomize','sodomy','son-of-a-bitch','souse','soused','spac','sperm','spic','spick','spik','spiks','splooge','splooge moose','spooge','spook','spread legs','spunk','steamy','stfu','stiffy','stoned','strap on','strapon','strappado','strip','strip club','stroke','stupid','style doggy','suck','suckass','sucked','sucking','sucks','suicide girls','sultry women','sumofabiatch','swastika','swinger','t1t','t1tt1e5','t1tties','tainted love','tampon','tard','taste my','tawdry','tea bagging','teabagging','teat','teets','teez','terd','teste','testee','testes','testical','testicle','testis','threesome','throating','thrust','thug','thundercunt','tied up','tight white','tinkle','tit','titfuck','titi','tits','titt','tittie5','tittiefucker','titties','titty','tittyfuck','tittyfucker','tittywank','titwank','toke','tongue in a','toots','topless','tosser','towelhead','tramp','tranny','transsexual','trashy','tribadism','tub girl','tubgirl','turd','tush','tushy','tw4t','twat','twathead','twatlips','twats','twatty','twatwaffle','twink','twinkie','two girls one cup','twunt','twunter','ugly','unclefucker','undies','undressing','unwed','upskirt','urethra play','urinal','urine','urophilia','uterus','uzi','v14gra','v1gra','vag','vagina','vajayjay','va-j-j','valium','venus mound','viagra','vibrator','violet wand','virgin','vixen','vjayjay','vodka','vomit','vorarephilia','voyeur','vulgar','vulva','w00se','wad','wang','wank','wanker','wankjob','wanky','wazoo','wedgie','weed','weenie','weewee','weiner','weirdo','wench','wet dream','wetback','wh0re','wh0reface','white power','whitey','whiz','whoar','whoralicious','whore','whorealicious','whorebag','whored','whoreface','whorehopper','whorehouse','whores','whoring','wigger','willies','willy','womb','woody','wop','wrapping men','wrinkled starfish','wtf','xrated','x-rated','xxx','yaoi','yeasty','yellow showers','yiffy','yobbo','zoophile','zoophilia','zubb'],
	
	show : function(uid,max_symbols) {
		
		if (max_symbols)
			this.MAX_SYMBOLS=max_symbols
		else
			this.MAX_SYMBOLS=50
				
		this.set_keyboard_layout(['RU','EN'][LANG]);
				
		this.uid = uid;
		objects.feedback_msg.text ='';
		objects.feedback_control.text = `0/${this.MAX_SYMBOLS}`
				
		anim2.add(objects.feedback_cont,{y:[-400, objects.feedback_cont.sy]}, true, 0.4,'easeOutBack');	
		return new Promise(function(resolve, reject){					
			feedback.p_resolve = resolve;	  		  
		});
		
	},
	
	set_keyboard_layout(lang) {
		
		this.lang = lang;
		
		if (lang === 'RU') {
			this.keyboard_layout = this.rus_keys;
			objects.feedback_bcg.texture = gres.feedback_bcg_rus.texture;
		} 
		
		if (lang === 'EN') {
			this.keyboard_layout = this.eng_keys;
			objects.feedback_bcg.texture = gres.feedback_bcg_eng.texture;
		}
		
	},
	
	close : function() {
			
		anim2.add(objects.feedback_cont,{y:[objects.feedback_cont.y,450]}, false, 0.4,'easeInBack');		
		
	},
	
	response_message:function(s) {

		
		objects.feedback_msg.text = s.name.text.split(' ')[0]+', ';	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${feedback.MAX_SYMBOLS}`		
		
	},
	
	get_texture_for_key (key) {
		
		if (key === '<' || key === 'EN' || key === 'RU') return gres.hl_key1.texture;
		if (key === 'ЗАКРЫТЬ' || key === 'ОТПРАВИТЬ' || key === 'SEND' || key === 'CLOSE') return gres.hl_key2.texture;
		if (key === '_') return gres.hl_key3.texture;
		return gres.hl_key0.texture;
	},
	
	key_down : function(key) {
		
		
		if (objects.feedback_cont.visible === false || objects.feedback_cont.ready === false) return;
		
		key = key.toUpperCase();
		
		if (key === 'ESCAPE') key = {'RU':'ЗАКРЫТЬ','EN':'CLOSE'}[this.lang];			
		if (key === 'ENTER') key = {'RU':'ОТПРАВИТЬ','EN':'SEND'}[this.lang];	
		if (key === 'BACKSPACE') key = '<';
		if (key === ' ') key = '_';
			
		var result = this.keyboard_layout.find(k => {
			return k[4] === key
		})
		
		if (result === undefined) return;
		this.pointerdown(null,result)
		
	},
	
	pointerdown : function(e, inp_key) {
		
		let key = -1;
		let key_x = 0;
		let key_y = 0;		
		
		if (e !== null) {
			
			let mx = e.data.global.x/app.stage.scale.x - objects.feedback_cont.x;
			let my = e.data.global.y/app.stage.scale.y - objects.feedback_cont.y;;

			let margin = 5;
			for (let k of this.keyboard_layout) {			
				if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin) {
					key = k[4];
					key_x = k[0];
					key_y = k[1];
					break;
				}
			}			
			
		} else {
			
			key = inp_key[4];
			key_x = inp_key[0];
			key_y = inp_key[1];			
		}
		
		//не нажата кнопка
		if (key === -1) return;			
				
		//подсвечиваем клавишу
		objects.hl_key.x = key_x - 10;
		objects.hl_key.y = key_y - 10;		
		objects.hl_key.texture = this.get_texture_for_key(key);
		anim2.add(objects.hl_key,{alpha:[1, 0]}, false, 0.5,'linear');
						
		if (key === '<') {
			objects.feedback_msg.text=objects.feedback_msg.text.slice(0, -1);
			key ='';
		}			
		
		
		if (key === 'EN' || key === 'RU') {
			this.set_keyboard_layout(key)
			return;	
		}	
		
		if (key === 'ЗАКРЫТЬ' || key === 'CLOSE') {
			this.close();
			this.p_resolve(['close','']);	
			key ='';
			sound.play('keypress');
			return;	
		}	
		
		if (key === 'ОТПРАВИТЬ' || key === 'SEND') {
			
			if (objects.feedback_msg.text === '') return;
			
			//если нашли ненормативную лексику то закрываем
			let mats =/шлю[хш]|п[еи]д[аеор]|суч?ка|г[ао]ндо|х[ую][ейяе]л?|жоп|соси|дроч|чмо|говн|дерьм|трах|секс|сосат|выеб|пизд|срал|уеб[аико]щ?|ебень?|ебу[ч]|ху[йия]|еба[нл]|дроч|еба[тш]|педик|[ъы]еба|ебну|ебл[аои]|ебись|сра[кч]|манда|еб[лн]я|ублюд|пис[юя]/i;		
			
			let text_no_spaces = objects.feedback_msg.text.replace(/ /g,'');
			
			const words = objects.feedback_msg.text.split(' ');
			const has_stop_words=words.some(word => {
			  return feedback.en_stop_list.includes(word.toLowerCase())
			});			
			
			
			if (text_no_spaces.match(mats) || has_stop_words) {
				sound.play('locked2');
				this.close();
				this.p_resolve(['close','']);	
				key ='';
				return;
			}
			
			

			
			
			this.close();
			this.p_resolve(['sent',objects.feedback_msg.text]);	
			key ='';
			sound.play('keypress');
			return;	
		}	
		
		
		
		if (objects.feedback_msg.text.length >= this.MAX_SYMBOLS)  {
			sound.play('locked');
			return;			
		}
		
		if (key === '_') {
			objects.feedback_msg.text += ' ';	
			key ='';
		}			
		

		sound.play('keypress');
		
		objects.feedback_msg.text += key;	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${this.MAX_SYMBOLS}`		
		
	}
	
}

message =  {
	
	promise_resolve :0,
	
	add : async function(text) {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");
		
		//воспроизводим звук
		game_res.resources.block_wall.sound.play();

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{x:[-200,objects.message_cont.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, 3000)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{x:[objects.message_cont.sx, -200]}, false, 0.5,'easeInBack');			
	}

}

anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	any_on () {
		
		for (let s of this.slot)
			if (s !== null)
				return true
		return false;		
	},
	
	linear(x) {
		return x
	},
	
	kill_anim(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
    easeOutBounce(x) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    },
	
	easeOutElastic(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad(x) {
		return x * x;
	},
	
	ease2back(x) {
		return Math.sin(x*Math.PI);
	},
	
	easeInOutCubic(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	add (obj, params, vis_on_end, time, func) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);

		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					
					//если начального показателя нет то устанавливаем его текущим
					if (!params[key][0])						
						params[key][0]=obj[key]
						
					params[key][2]=params[key][1]-params[key][0];
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					
					
				this.slot[i] = {
					obj,
					params,
					vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

	},	
	
	process() {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i]) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		
				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

big_message = {
	
	p_resolve : 0,
		
	show: function(t1,t2) {
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{y:[-180,objects.big_message_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	close : function() {
		
		if (objects.big_message_cont.ready===false)
			return;

		gres.close_it.sound.play();
		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

online_game = {
		
	timer_id : 0,
	move_time_left : 0,
	me_conf_play : 0,
	opp_conf_play : 0,
	start_time : 0,	
	disconnect_time : 0,
	no_incoming_move : 0,
	
	calc_new_rating : function (old_rating, game_result) {
				
		if (game_result === NOSYNC)
			return old_rating;
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));
		
	},
	
	send_move : function  (data) {
		
		
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:data});
		
		//также фиксируем данные стола
		firebase.database().ref("tables/"+game_id).set({uid:my_data.uid,f_str:ffunc.get_minified_field(game.field),tm:firebase.database.ServerValue.TIMESTAMP});

	},
	
	async init(r) {
		
		this.me_conf_play = 0;
		this.opp_conf_play = 0;
		
		if (state === 'b') {
			//убираем кнопку стоп
			objects.stop_bot_button.visible=false;			
		}

		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'p'});

		//получаем информацию о фишке соперника
		let snapshot = await firebase.database().ref('players/'+opp_data.uid+'/chip').once('value');
		let opp_chip = snapshot.val()||0;
		objects.opp_icon.texture = gres['chip'+opp_chip].texture;
		
		//это если фишки совпадают
		if (opp_chip===my_data.chip)
			objects.opp_icon.tint=0x88ff88;
		else
			objects.opp_icon.tint=0xffffff;
		
		//показываем кнопки
		objects.game_buttons_cont.visible = true;

		this.reset_timer(30);
		
		this.timer_id = setTimeout(function(){online_game.timer_tick()}, 1000);
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		let lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		if (lose_rating >100 && lose_rating<9999)
			firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);
	
	},
	
	reset_timer : function(t) {
		
		//обовляем время разъединения
		this.disconnect_time = 0;
		
		if (t===undefined)
			this.move_time_left=40;
		else
			this.move_time_left=t;
		objects.timer.tint=0xffffff;	
		
	},
	
	timer_tick : function () {
		
		this.move_time_left--;
		
		if (this.move_time_left >= 0) {
			if ( this.move_time_left >9 )
				objects.timer.text = '0:'+this.move_time_left;
			else
				objects.timer.text = '0:0'+this.move_time_left;
		}
		
		if (this.move_time_left < 0 && my_turn === 1)	{
			
			if (this.me_conf_play === 1)
				game.stop('my_timeout');
			else
				game.stop('my_no_sync');	
			
			return;
		}

		if (this.move_time_left < -5 && my_turn === 0)	{
			
			if (this.opp_conf_play === 1)
				game.stop('opp_timeout');
			else
				game.stop('opp_no_sync');
			
			return;
		}
		
		if (connected === 0 && my_turn === 0) {
			this.disconnect_time ++;
			if (this.disconnect_time > 5) {
				game.stop('my_no_connection');
				return;				
			}
		}

		//подсвечиваем красным если осталость мало времени
		if (this.move_time_left === 15) {
			objects.timer.tint=0xff0000;
			gres.clock.sound.play();
		}
		
		//обновляем текст на экране
		objects.timer.text="0:"+this.move_time_left;
		
		this.timer_id = setTimeout(function(){online_game.timer_tick()}, 1000);
		
	},
	
	stop : async function(result) {
					
		let res_array = [
			['my_timeout',LOSE, ['Вы проиграли!\nУ вас закончилось время','You have lost!\nYou have run out of time']],
			['opp_timeout',WIN , ['Вы выиграли!\nУ соперника закончилось время','You won!\nThe opponent has run out of time']],
			['my_giveup' ,LOSE, ['Вы сдались!','You have given up!']],
			['opp_giveup' ,WIN , ['Вы выиграли!\nСоперник сдался','You won!\nOpponent gave up']],
			['both_finished',DRAW, ['Ничья','Draw']],
			['my_finished_first',WIN , ['Вы выиграли!\nБыстрее соперника добрались до цели','You won!\nFaster than the opponent got to the goal']],
			['opp_finished_first',LOSE, ['Вы проиграли!\nСоперник оказался быстрее вас.','You have lost!\nOpponent was faster than you']],
			['my_closer_after_80',WIN , ['Вы выиграли!\nВы оказались ближе к цели.','You won!\nYou were closer to the goal']],
			['opp_closer_after_80',LOSE, ['Вы проиграли!\nСоперник оказался ближе к цели.','You have lost!\nOpponent was closer to the goal']],
			['both_closer_80',DRAW , ['Ничья\nОба на одинаковом расстоянии до цели','Draw\nBoth at the same distance to the goal']],
			['my_no_sync',NOSYNC , ['Похоже вы не захотели начинать игру.','It looks like you did not want to start the game']],
			['opp_no_sync',NOSYNC , ['Похоже соперник не смог начать игру.','It looks like the opponent could not start the game']],
			['my_no_connection',LOSE , ['Потеряна связь!\nИспользуйте надежное интернет соединение.','Lost connection!\nUse a reliable internet connection']]
		];
			
		
			
		clearTimeout(this.timer_id);		
		
		let result_row = res_array.find( p => p[0] === result);
		let result_str = result_row[0];
		let result_number = result_row[1];
		let result_info = result_row[2][LANG];				
		let old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, result_number);
		objects.my_card_rating.text = my_data.rating;
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
	
		//также фиксируем данные стола
		firebase.database().ref("tables/"+game_id).set({uid:my_data.uid,fin_flag:1,tm:firebase.database.ServerValue.TIMESTAMP});

		
		//убираем элементы
		objects.timer.visible = false;
		
		//убираем кнопки
		objects.game_buttons_cont.visible = false;
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC ) {
			
			game_res.resources.lose.sound.play();	
			
		}
		else 
		{
			if (game_platform === 'CRAZYGAMES') {
				window.CrazyGames.SDK.game.happytime();
			}
			game_res.resources.win.sound.play();			
		}

				

		//если игра результативна то записываем дополнительные данные
		if (result_number === DRAW || result_number === LOSE || result_number === WIN) {
			
			//увеличиваем количество игр
			my_data.games++;
			firebase.database().ref("players/"+[my_data.uid]+"/games").set(my_data.games);		

			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			firebase.database().ref("finishes/"+game_id + my_role).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result_str,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			
		}
		
		await big_message.show(result_info, ['Рейтинг','Rating'][LANG]+`: ${old_rating} > ${my_data.rating}`)
	
	}

};

bot_player = {
	
	true_rating : 34634,	
	timer : 0,
	me_conf_play : 0,
	opp_conf_play : 0,
	move_time_left : 0,
	search_start_time : 0,
	no_incoming_move : 0,
		
	send_move : async function  () {
		
		let root_node = new node_class(game.field, MY_ID, 0);
		let best_child = await this.start_mm_search(root_node);
		if (!best_child) return;
		game.receive_move(best_child.move_data);
		
	},
	
	async init() {
		
		this.pending_stop
		
		set_state({state : 'b'});	

		//показываем кнопку стоп
		objects.stop_bot_button.visible = true;
		objects.stop_bot_button.pointerdown=function(){game.stop_down()};
		
		const opp_chip=irnd(0,17);
		objects.opp_icon.texture = gres['chip'+opp_chip].texture;
		
		//это если фишки совпадают
		if (opp_chip===my_data.chip)
			objects.opp_icon.tint=0x88ff88;
		else
			objects.opp_icon.tint=0xffffff;
		
		//отключаем таймер...........................
		objects.timer.text  = ['Мой ход...','My move...'][LANG];
	},
	
	async stop(result) {
		
		let res_array = [
			['my_stop' ,DRAW, ['Вы отменили игру!','You canceled the game']],
			['both_finished',DRAW, 'Ничья'],
			['my_finished_first',WIN , ['Вы выиграли!\nБыстрее соперника добрались до цели','You have won!\nGot to the goal faster than the opponent']],
			['opp_finished_first',LOSE, ['Вы проиграли!\nСоперник оказался быстрее вас.','You have lost!\nThe opponent was faster than you.']],
			['my_closer_after_80',WIN , ['Вы выиграли!\nВы оказались ближе к цели.','You have won!\nYou were closer to the goal.']],
			['opp_closer_after_80',LOSE, ['Вы проиграли!\nСоперник оказался ближе к цели.','You have lost!\nThe opponent was closer to the goal']],
			['both_closer_80',DRAW , ['Ничья!\nОба на одинаковом расстоянии до цели','Draw!\nBoth at the same distance to the goal']]
		];
						
		this.no_incoming_move = 1;
		
		let result_number = res_array.find( p => p[0] === result)[1];
		let result_info = res_array.find( p => p[0] === result)[2][LANG];				
			
		//выключаем элементы
		objects.timer.visible = false;

		//убираем кнопку стоп
		objects.stop_bot_button.visible=false;
		
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			game_res.resources.lose.sound.play();
		else
			game_res.resources.win.sound.play();		
		
		await big_message.show(result_info, ['Сыграйте с реальным соперником для получения рейтинга','Play online with other player to increase rating'][LANG])
	
	},
	
	silent_stop() {
		
		
		//убираем кнопку стоп
		objects.stop_bot_button.visible=false;
		
		
	},
	
	reset_timer() {
		
		
	},
	
	async start_mm_search(node) {
		
		//ходит бот
		node.add_childs(1);
		let max_val = -999999;
		let best_child = {};
		for (let c0 of node.childs) {
			
			
			await new Promise((resolve, reject) => setTimeout(resolve, 50));
			
			//проверяем что этот ход ведет напрямую к выигрышу
			if (ffunc.get_winner(c0.field) === OPP_ID)
				return c0;
						
			//ходит игрок
			c0.add_childs_only_moves(0);
			let min_val1 = 99999;
			for (let c1 of c0.childs) {
				
				//ходит бот
				c1.add_childs(0);
				let max_val2 = -99999;
				for (let c2 of c1.childs) {
					
					
					//экстренный выход
					if (objects.big_message_cont.visible === true)
						return;
										
					let d_for_my = ffunc.get_shortest_distance_to_target(c2.field,MY_ID,ROW0);
					let d_for_opp = ffunc.get_shortest_distance_to_target(c2.field,OPP_ID,ROW8);
					let how_opp_faster = d_for_my - d_for_opp;
					
					if (how_opp_faster > max_val2)
						max_val2 = how_opp_faster;
				}	
				

			if (min_val1 > max_val2)
				min_val1 = max_val2;

			
			}	

		if (min_val1 > max_val) {
			max_val = min_val1;			
			best_child = c0;
			
		}
		
		}

		return best_child;
		
	}
	

	
};

mcts = {	

	run : function(node) {
		
		//expansion
		let c_num = node.childs.length;
		if (c_num === 0) {
			
			if (node.depth > 6) {				
				this.simulate(node)
				return;				
			}			
			
			this.expand(node);		

			
			this.simulate_childs(node);
			return;
		} 
		
		//selection
		let max_ucb = - 999999;
		let max_ucb_child = 0;
		let next_move_player_id =  3 - node.player_id;
		for (let i = 0 ; i < c_num; i++ ) {
			
			let c = node.childs[i];
			let ucb = 999999;
			if (c.visited > 0)
				ucb = c.wins[next_move_player_id] / c.visited + 2 * Math.sqrt(Math.log(c.parent.visited)/c.visited);				
			
			if (ucb > max_ucb) {
				max_ucb = ucb;
				max_ucb_child = c;				
			}			
		}
		
		this.run(max_ucb_child);

	},
	
	expand : function(node) {
		
		let save_move_data = 0;
		if (node.depth === 0) {
			save_move_data = 1;			
		} 
		
		node.add_child(save_move_data);

	},
	
	simulate_childs : function(node) {
				
		let c_num = node.childs.length;
					
		for ( let i = 0 ; i < c_num ; i++)
			this.simulate(node.childs[i]);
	
	},
		
	simulate : function(node) {
		
		
		let s_field = JSON.parse(JSON.stringify(node.field));
		
		//проврка не терминальный ли это ход
		if(s_field.player_id === OPP_ID) {
			let winner = ffunc.get_winner(s_field);
			if ( winner !== 3 ) {
				this.back_res(node, winner)
				return;
			}			
		}
		
		let player_to_move = 3 - node.player_id;
				
		while (true) {
						
			ffunc.perform_random_move(s_field, player_to_move);

			//проверяем завершение игры
			if (player_to_move === OPP_ID) {
									
				let winner = ffunc.get_winner(s_field);				
				if ( winner !== 3 ) {										
					this.back_res(node, winner)
					return;
				}
			}			
			
			player_to_move = 3 - player_to_move;						
		}		
	
	
	},
		
	back_res: function(node, win_player) {
		
		node.wins[win_player]++;
		node.visited ++;
		if (node.parent !== null)
			this.back_res(node.parent, win_player)
		
	}
	
};

ffunc = {
	
	blocked_way (field, r, c, tar_row, init) {
		
		if (r === tar_row)
			return 0;
		
		//если начинаем сначала то все ячейки становятся не посещенными
		if (init === 1) {				
			for (let r=0;r<9;r++)
				for (let c=0;c<9;c++)
					field.f[r][c].visited = 0;		
		}		
		
		if (field.f[r][c].visited === 1)
			return 1;		
		field.f[r][c].visited = 1;

		if (ffunc.check_move.left_w(field, r, c) === 1) {			
			let res = ffunc.blocked_way(field, r, c - 1, tar_row, 0);
			if (res === 0)
				return 0;			
		}
		
		if (ffunc.check_move.right_w(field, r, c) === 1) {			
			let res = ffunc.blocked_way(field, r, c + 1, tar_row, 0);
			if (res === 0)
				return 0;			
		}
			
		if (ffunc.check_move.up_w(field, r, c) === 1) {			
			let res = ffunc.blocked_way(field, r - 1 , c, tar_row, 0);
			if (res === 0)
				return 0;			
		}
			
		if (ffunc.check_move.down_w(field, r, c) === 1) {			
			let res = ffunc.blocked_way(field, r + 1 , c, tar_row, 0);
			if (res === 0)
				return 0;			
		}
		
		return 1;		
	},
		
	init (field) {
		
		
		//создаем поле
		field.f = [];
		field.pos = {};
		
		
		//очищаем поле
		for (let r = 0; r < 9; r++ ) {
			field.f.push([{},{},{},{},{},{},{},{},{}]);
			
			for (let c = 0; c < 9; c++ ) {				
				field.f[r][c].wall_type = 0;
				field.f[r][c].wall_owner = 0;
				field.f[r][c].visited = 0;					
				field.f[r][c].player = 0;	
			}
		}
		
		//обозначаем игроков
		field.f[0][4].player = OPP_ID;	
		field.f[8][4].player = MY_ID;	
		
		//позиции игроков в отдельный массив
		field.pos[MY_ID] = {r: 8, c: 4, walls: 10};
		field.pos[OPP_ID] = {r: 0, c: 4, walls : 10};
		
	},
	
	get_minified_field(field){
		
		let data_str="";
		for (let r = 0; r < 9; r++ )
			for (let c = 0; c < 9; c++ )
				data_str+=field.f[r][c].wall_type;

		data_str+=field.pos['1'].r;
		data_str+=field.pos['1'].c;
		data_str+=field.pos['2'].r;
		data_str+=field.pos['2'].c;
		data_str+=",";
		data_str+=field.pos['1'].walls;
		data_str+=",";
		data_str+=field.pos['2'].walls;
		
		return data_str;		
		
	},
	
	make_move (field, r0, c0, r1, c1) {
		
		
		let player_id = field.f[r0][c0].player;		

		field.f[r0][c0].player = 0;		
		field.f[r1][c1].player = player_id;
		
		field.pos[player_id].r = r1;
		field.pos[player_id].c = c1;


	},
	
	draw(field) {
		
		let wall_iter = 0;
				
		//убираем все стены
		objects.walls.forEach(w=>w.visible = false);
		objects.walls_cont.visible = true;
		
		//сначала рисуем стены
		for (let r = 0; r < 9; r++ ) {
			for (let c = 0; c < 9; c++ ) {	
				
				const cell = field.f[r][c];
				const wall=objects.walls[wall_iter];
				
				if (cell.wall_type === V_WALL) {	
					wall.height=140;
					wall.width=40;
					wall.tint=[0xaaaaaa,0xffffff,0xff7777][cell.wall_owner];
					wall.x = objects.field.x + FIELD_MARGIN + c * 50;
					wall.y = objects.field.y + FIELD_MARGIN + r * 50;
					wall.texture=gres.v_wall.texture;										
					wall.visible = true;
					wall_iter++;
				}
				
				if (cell.wall_type === H_WALL) {
					wall.height=40;
					wall.width=140;
					wall.tint=[0xaaaaaa,0xffffff,0xff7777][cell.wall_owner];
					wall.x = objects.field.x + FIELD_MARGIN + c * 50;
					wall.y = objects.field.y + FIELD_MARGIN + r * 50;
					wall.texture=gres.h_wall.texture;					
					wall.visible = true;
					wall_iter++;
				}				
				
				if (cell.player === MY_ID) {					
					objects.my_icon.x = objects.field.x + FIELD_MARGIN + c * 50;
					objects.my_icon.y = objects.field.y + FIELD_MARGIN + r * 50;
					objects.my_icon.visible = true;					
				}
				
				if (cell.player === OPP_ID) {					
					objects.opp_icon.x = objects.field.x + FIELD_MARGIN + c * 50;
					objects.opp_icon.y = objects.field.y + FIELD_MARGIN + r * 50;
					objects.opp_icon.visible = true;					
				}				
			}
		}		
	},
	
	check_if_wall_block(field, wr, wc, wtype) {
		
		field.f[wr][wc].wall_type = wtype;
		
		if (this.blocked_way(field, field.pos[OPP_ID].r, field.pos[OPP_ID].c, ROW8, 1) === 1) {
			field.f[wr][wc].wall_type = 0;
			//console.log('blocked opp');
			return 1;			
		}
		
		if (this.blocked_way(field, field.pos[MY_ID].r, field.pos[MY_ID].c, ROW0, 1) === 1) {
			field.f[wr][wc].wall_type = 0;
			//console.log('blocked me');
			return 1;			
		}
		
		field.f[wr][wc].wall_type = 0;
		return 0;
		
	},
	
	get_random_wall_with_block_check( field, player_id ) {
		
		if (field.pos[player_id].walls === 0)
			return {type : 'wall', r: 0, c: 0, wall_type: -1};	
		
		for (let i = 0 ; i < 1000 ; i++) {
			
			let wall_type = Math.random() > 0.5 ? V_WALL : H_WALL;
			let r = irnd(1,8);
			let c = irnd(1,8);
			let check = this.check_new_wall(field, r, c, wall_type);
			
			if (check === 1) {								
				let blocked = this.check_if_wall_block(field, r, c, wall_type);
				if (blocked !== 1)
					return {type : 'wall', r: r, c: c, wall_type: wall_type};
			}			
		}
		
		return {type : 'wall', r: 0, c: 0, wall_type: -1};	
		
	},
	
	get_random_wall( field, player_id ) {
		
		if (field.pos[player_id].walls === 0)
			return {type : 'wall', r: 0, c: 0, wall_type: -1};	
		
		for (let i = 0 ; i < 1000 ; i++) {
			
			let wall_type = Math.random() > 0.5 ? V_WALL : H_WALL;
			let r = irnd(1,8);
			let c = irnd(1,8);
			let check = this.check_new_wall(field, r, c, wall_type);
			
			if (check === 1) 							
				return {type : 'wall', r: r, c: c, wall_type: wall_type};

		}
		
		return {type : 'wall', r: 0, c: 0, wall_type: -1};	
		
	},
		
	check_new_wall(field, r, c, wall_type) {
		
		if (c === 0)	return 0;		
		if (r === 0)	return 0;		
		if (c === 9)	return 0;		
		if (r === 9)	return 0;
		
		//если какая-то стена уже есть на этом месте
		if (field.f[r][c].wall_type !== 0)	return 0;
		
		if (wall_type === H_WALL) {			
			if (c === 8) {
				if (field.f[r][c-1].wall_type === H_WALL)
					return 0;
			}
			else
			{
				if (field.f[r][c-1].wall_type === H_WALL || field.f[r][c+1].wall_type === H_WALL)
					return 0;				
			}
		}		
		else
		{
			if (r === 8) {
				if (field.f[r-1][c].wall_type === V_WALL)
					return 0;
			}
			else
			{
				if (field.f[r-1][c].wall_type === V_WALL || field.f[r+1][c].wall_type === V_WALL)
					return 0;				
			}
		}
		
		return 1;	
		
	},
	
	get_moves(field, PLAYER_ID) {
		
		
		let r = field.pos[PLAYER_ID].r;		
		let c = field.pos[PLAYER_ID].c;
		let moves = [];
		
		if (ffunc.check_move.left(field, r, c) === 1)
			moves.push({type: 'move', r0: r, c0: c, r1: r, c1: c - 1});		
		
		if (ffunc.check_move.right(field, r, c) === 1) 
			moves.push({type: 'move',r0: r, c0: c, r1: r, c1: c + 1});	
		
		if (ffunc.check_move.up(field, r, c) === 1)
			moves.push({type: 'move',r0: r, c0: c, r1: r - 1, c1: c});	
		
		if (ffunc.check_move.down(field, r, c) === 1)
			moves.push({type: 'move',r0: r, c0: c, r1: r + 1, c1: c});	
		
		if (ffunc.check_move.up_jump(field, r, c) === 1)	
			moves.push({type: 'move',r0: r, c0: c, r1: r - 2,c1:c});	
		
		if (ffunc.check_move.left_jump(field, r, c) === 1)	
			moves.push({type: 'move',r0: r, c0: c, r1: r ,c1:c - 2});
		
		if (ffunc.check_move.right_jump(field, r, c) === 1)	
			moves.push({type: 'move',r0: r, c0: c, r1: r ,c1:c + 2});
		
		if (ffunc.check_move.up_left(field, r, c) === 1)
			moves.push({type: 'move',r0: r, c0: c, r1: r - 1, c1:c - 1});	
		
		if (ffunc.check_move.up_right(field, r, c) === 1)
			moves.push({type: 'move',r0: r, c0: c, r1: r - 1, c1:c + 1});	

		if (ffunc.check_move.down_left(field, r, c) === 1)
			moves.push({type: 'move',r0: r, c0: c, r1: r + 1, c1:c - 1});	
		
		if (ffunc.check_move.down_right(field, r, c) === 1)
			moves.push({type: 'move',r0: r, c0: c, r1: r + 1, c1:c + 1});		
		
		if (ffunc.check_move.down_jump(field, r, c) === 1)
			moves.push({type: 'move',r0: r, c0: c, r1: r + 2, c1:c});			
		
		return moves;		
	},
	
	get_simple_moves_for_bfs(field, r, c) {
		
		

		let moves = [];
		
		if (ffunc.check_move.left_w(field, r, c) === 1)
			moves.push([r, c - 1]);		
		
		if (ffunc.check_move.right_w(field, r, c) === 1) 
			moves.push([r, c + 1]);	
		
		if (ffunc.check_move.up_w(field, r, c) === 1)
			moves.push([r - 1, c]);	
		
		if (ffunc.check_move.down_w(field, r, c) === 1)
			moves.push([r + 1, c]);	
					
		
		return moves;		
	},
			
	get_random_move(field, player_id) {
				
		let new_wall_data = ffunc.get_random_wall_with_block_check(field, player_id );
		let moves = ffunc.get_moves( field, player_id );
		
		
		
		//если стены нельзя поставить
		if ( new_wall_data.wall_type === -1 ) {			
	
			if (moves.length > 0) {			
				let move_id = irnd(0, moves.length - 1);
				return moves[move_id];
			} else {
			
				return {type: 'move', r0: field.pos[player_id].r, c0: field.pos[player_id].c, r1: field.pos[player_id].r, c1: field.pos[player_id].c};
			}			
			
		} else {
		//если можно поставить стену
			
			if (moves.length > 0) {
				
				if (Math.random() > 0.55) {
					let move_id = irnd(0, moves.length - 1);
					return moves[move_id];
				} else {					
					return new_wall_data;	
				}
				
			} else {
				return new_wall_data;
			}
		}

		
		alert("Не получилось найти ход")
		
	},
	
	get_walls_num (field) {
		
		let walls_num = 0 ;
		for (let r = 0; r < 9; r++ ) {
			
			for (let c = 0; c < 9; c++ ) {
				
				if (field.f[r][c].wall_type >0)
					walls_num++;
				
			}				
			
		}
		
		return walls_num;
	},
	
	get_players_num(field) {
		
		let walls_num = 0 ;
		for (let r = 0; r < 9; r++ ) {
			
			for (let c = 0; c < 9; c++ ) {
				
				if (field.f[r][c].player >0)
					walls_num++;
				
			}				
			
		}
		
		return walls_num;

		
	},
	
	perform_random_move(field, player_id) {
		
		
		let walls_num =ffunc.get_walls_num(field);
		if ((20-walls_num) !== (field.pos[1].walls + field.pos[2].walls )) {			
			console.log("что то не так с количеством стен");
		}
		
		if (ffunc.get_players_num(field) !== 2) {
			
			console.log("что то не так с количеством игроков");
		}
		
		let move_data = this.get_random_move(field, player_id);
		
		if (move_data.type === 'move') {
			

			ffunc.make_move(field, move_data.r0, move_data.c0, move_data.r1, move_data.c1);
			
		}
		
		if (move_data.type === 'wall') {
			
			//устанаваем полученную стену в наше поле
			field.f[move_data.r][move_data.c].wall_type = move_data.wall_type;
			field.pos[player_id].walls--;			
		}
		
		return move_data;
		
	},
	
	get_winner(field) {
		
			
		if ( field.pos[MY_ID].r === ROW0 && field.pos[OPP_ID].r !== ROW8 )
			return MY_ID;			
		if ( field.pos[MY_ID].r === ROW0 && field.pos[OPP_ID].r === ROW8 )
			return 0;				
		if (field.pos[MY_ID].r !== ROW0 && field.pos[OPP_ID].r === ROW8)
			return OPP_ID;		
		
		return 3;
				
	},
	
	check_move :  {
		
		left(field, r, c) {
			
			let tr = r;			
			let tc = c - 1;
			
			if (tc < 0)	return 0;			
			
			//если на пути кто-нибудь из игроков
			if (field.f[tr][tc].player > 0)
				return 0;						
			
			if (field.f[r][c].wall_type === V_WALL)
				return 0;	
			
			if (tr < 8 && field.f[tr+1][c].wall_type === V_WALL)
				return 0;
			
			return 1;
		},
		
		right(field, r, c) {			

			let tr = r;			
			let tc = c + 1;

			if (tc > 8)	return 0;	
			
						
			//если на пути кто-нибудь из игроков
			if (field.f[tr][tc].player > 0)
				return 0;		
			
			if (field.f[tr][tc].wall_type === V_WALL)
				return 0;	
			
			if (tr < 8 && field.f[tr+1][tc].wall_type === V_WALL)
				return 0;
			
			return 1;
			
		},
		
		up(field, r, c) {
			
			let tr = r - 1;			
			let tc = c;

			if (tr < 0)	return 0;	
			
						
			//если на пути кто-нибудь из игроков
			if (field.f[tr][tc].player > 0)
				return 0;		
			
			if (field.f[r][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;
			
		},
		
		down(field, r, c) {
			
			let tr = r + 1;			
			let tc = c;

			if (tr > 8)	return 0;	
			
						
			//если на пути кто-нибудь из игроков
			if (field.f[tr][tc].player > 0)
				return 0;		
			
			if (field.f[r + 1][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r + 1][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;
		},
		
		up_jump(field, r, c) {
			
			let tr = r - 2;			
			let tc = c;

			if (tr < 0)	return 0;	
									
			//есть нет игрока чтобы перепрыгнуть выходим
			if (field.f[r - 1][c].player === 0)
				return 0;
			
			
			if (field.f[r][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r][c + 1].wall_type === H_WALL)
				return 0;
			
			if (field.f[r - 1][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r - 1][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;		
		},
		
		down_jump(field, r, c) {
			
			let tr = r + 2;			
			let tc = c;

			if (tr > 8)	return 0;	
									
			//есть нет игрока чтобы перепрыгнуть выходим
			if (field.f[r + 1][c].player === 0)
				return 0;
			
			
			if (field.f[r + 1][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r + 1][c + 1].wall_type === H_WALL)
				return 0;
			
			if (field.f[r + 2][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r + 2][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;		
		},
		
		left_jump(field, r, c) {
			
			let tr = r;			
			let tc = c - 2;

			if (tc < 0)	return 0;	
									
			//есть нет игрока чтобы перепрыгнуть выходим
			if (field.f[r][c - 1].player === 0)
				return 0;
			
			
			if (field.f[r][c].wall_type === V_WALL)
				return 0;	
			
			if (r < 8 && field.f[r + 1][c].wall_type === V_WALL)
				return 0;
						
			if (field.f[r][c - 1].wall_type === V_WALL)
				return 0;	
			
			if (r < 8 && field.f[r + 1][c - 1].wall_type === V_WALL)
				return 0;
			
			return 1;			
		},
		
		right_jump(field, r, c) {
			
			let tr = r;			
			let tc = c + 2;

			if (tc > 8)	return 0;	
									
			//есть нет игрока чтобы перепрыгнуть выходим
			if (field.f[r][c + 1].player === 0)
				return 0;
			
			
			if (field.f[r][c + 1].wall_type === V_WALL)
				return 0;	
			
			if (r < 8 && field.f[r + 1][c + 1].wall_type === V_WALL)
				return 0;
						
			if (field.f[r][c + 2].wall_type === V_WALL)
				return 0;	
			
			if (r < 8 && field.f[r + 1][c + 2].wall_type === V_WALL)
				return 0;
			
			return 1;				
		},
		
		blocked_opp_up(field,r,c){			
		
			if(this.up_w(field,r,c)===0) return 0;
			if (field.f[r-1][c].player === 0) return 0;				
			if (r===1) return 1;			
			if(field.f[r-1][c].wall_type === H_WALL) return 1;			
			if(c<8&&field.f[r-1][c+1].wall_type === H_WALL) return 1;
			return 0;			
		},
		
		blocked_opp_down(field,r,c){		
			if(this.down_w(field,r,c)===0) return 0;
			if (field.f[r+1][c].player === 0) return 0;				
			if (r===7) return 1;			
			if(field.f[r+2][c].wall_type === H_WALL) return 1;			
			if(c<8&&field.f[r+2][c+1].wall_type === H_WALL) return 1;
			return 0;			
		},
		
		blocked_opp_left(field,r,c){			
			if(this.left_w(field,r,c)===0) return 0;
			if (field.f[r][c-1].player === 0) return 0;				
			if (c===1) return 1;			
			if(field.f[r][c-1].wall_type === V_WALL) return 1;			
			if(r<8&&field.f[r+1][c-1].wall_type === V_WALL) return 1;
			return 0;			
			
		},
		
		blocked_opp_right(field,r,c){		
			if(this.right_w(field,r,c)===0) return 0;
			if (field.f[r][c+1].player === 0) return 0;				
			if (c===7) return 1;			
			if(field.f[r][c+2].wall_type === V_WALL) return 1;			
			if(r<8&&field.f[r+1][c+2].wall_type === V_WALL) return 1;
			return 0;			
		},
								
		up_left(field, r, c) {
			
			let tr = r - 1;			
			let tc = c - 1;
			
			if (tc < 0)	return 0;		
			if (tr < 0)	return 0;	
			
			if (field.f[r][c].wall_type === V_WALL) return 0;				
			if (field.f[r][c].wall_type === H_WALL) return 0;	

			const up_blocked=this.blocked_opp_up(field, r, c);
			const left_blocked=this.blocked_opp_left(field, r, c);
			
			if (up_blocked===0 && left_blocked===0) return 0;
			
			if (field.f?.[r]?.[tc].wall_type === H_WALL&&field.f?.[r]?.[c+1]?.wall_type === H_WALL) return 0;	
			if (field.f?.[tr]?.[c].wall_type === V_WALL&&field.f?.[r+1]?.[c].wall_type === V_WALL) return 0;	
			if (field.f?.[r]?.[tc].wall_type === H_WALL&&field.f?.[tr]?.[c].wall_type === V_WALL) return 0;	
					
			return 1;			
		},
	
		up_right(field, r, c) {
			
			let tr = r - 1;			
			let tc = c + 1;
			
			if (tc > 8)	return 0;		
			if (tr < 0)	return 0;							
			
			if (field.f[r][tc].wall_type === V_WALL) return 0;				
			if (field.f[r][tc].wall_type === H_WALL) return 0;	

			const up_blocked=this.blocked_opp_up(field, r, c);
			const right_blocked=this.blocked_opp_right(field, r, c);
			
			if (up_blocked===0 && right_blocked===0) return 0;
			
			if (field.f?.[r]?.[c].wall_type === H_WALL&&field.f?.[r]?.[tc+1]?.wall_type === H_WALL) return 0;	
			if (field.f?.[tr]?.[tc].wall_type === V_WALL&&field.f?.[r+1]?.[tc].wall_type === V_WALL) return 0;	
			if (field.f?.[tr]?.[tc].wall_type === V_WALL&&field.f?.[r]?.[tc+1]?.wall_type === H_WALL) return 0;	
			
			return 1;			
		},	

		down_left(field, r, c) {
			
			let tr = r + 1;			
			let tc = c - 1;
			
			if (tc < 0)	return 0;		
			if (tr > 8)	return 0;	
			
			if (field.f[tr][c].wall_type === V_WALL) return 0;				
			if (field.f[tr][c].wall_type === H_WALL) return 0;	

			const left_blocked=this.blocked_opp_left(field, r, c);
			const down_blocked=this.blocked_opp_down(field, r, c);
			
			if (left_blocked===0 && down_blocked===0) return 0;
			
			if (field.f?.[r]?.[c].wall_type===V_WALL&&field.f?.[tr+1]?.[c].wall_type===V_WALL) return 0;	
			if (field.f?.[tr]?.[c].wall_type===H_WALL&&field.f?.[tr]?.[c-1]?.wall_type===H_WALL) return 0;	
			if (field.f?.[tr]?.[tc].wall_type===H_WALL&&field.f?.[tr+1]?.[c].wall_type===V_WALL) return 0;
			
			return 1;
		},		

		down_right(field, r, c) {
			
			let tr = r + 1;			
			let tc = c + 1;
			
			if (tc > 8)	return 0;		
			if (tr > 8)	return 0;	
			
			if (field.f[tr][tc].wall_type === V_WALL) return 0;				
			if (field.f[tr][tc].wall_type === H_WALL) return 0;	

			const right_blocked=this.blocked_opp_right(field, r, c);
			const down_blocked=this.blocked_opp_down(field, r, c);
			
			if (right_blocked===0 && down_blocked===0) return 0;
			
			if (field.f?.[tr]?.[c].wall_type===H_WALL&&field.f?.[tr]?.[tc+1]?.wall_type===H_WALL) return 0;	
			if (field.f?.[r]?.[tc].wall_type===V_WALL&&field.f?.[tr+1]?.[tc].wall_type===V_WALL) return 0;	
			if (field.f?.[tr+1]?.[tc].wall_type===V_WALL&&field.f?.[tr]?.[tc+1]?.wall_type===H_WALL) return 0;	
			
			return 1;			
		},			
			
		//это проверка возможности прохода с учетом стен
		left_w(field, r, c) {
							
			let tr = r;			
			let tc = c - 1;
			
			if (tc < 0)	return 0;			
									
			if (field.f[r][c].wall_type === V_WALL)
				return 0;	
			
			if (tr < 8 && field.f[tr+1][c].wall_type === V_WALL)
				return 0;
			
			return 1;
		},
		
		right_w(field, r, c) {			

			let tr = r;			
			let tc = c + 1;

			if (tc > 8)	return 0;	
			
			
			if (field.f[tr][tc].wall_type === V_WALL)
				return 0;	
			
			if (tr < 8 && field.f[tr+1][tc].wall_type === V_WALL)
				return 0;
			
			return 1;
			
		},
	
		up_w(field, r, c) {
			
			let tr = r - 1;			
			let tc = c;

			if (tr < 0)	return 0;	
			
			if (field.f[r][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;
			
		},
		
		down_w(field, r, c) {
			
			let tr = r + 1;			
			let tc = c;

			if (tr > 8)	return 0;	

			if (field.f[tr][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[tr][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;
		},
	},
	
	get_shortest_distance_to_target(field, player_id, target_row) {
		
		
		//устанавливаем все клетки как ранее не посещенные
		for (let r = 0; r < 9; r++ )
			for (let c = 0; c < 9; c++ )			
				field.f[r][c].visited = 0;					


		let r = field.pos[player_id].r;
		let c = field.pos[player_id].c;

		if (r === target_row)
			return 0;	
		
		
		//первая ячейка с которой начинается поиск
		field.f[r][c].visited = 1;
		let layer = [[r, c, 0]];
		
		//начинаем поиск по слоям
		for ( let d = 0 ; d < 100 ; d++ ) {
			
			//если не нашли пути
			if (layer.length === 0)
				return -1;
						
			
			for (c of layer) {
				
				let cell = layer.shift();
				
				let moves = this.get_simple_moves_for_bfs(field, cell[0], cell[1]);
				
				for (m of moves) {
					
					//если нашли конец пути
					if (m[0] === target_row)
						return cell[2]+1;						
					
					if (field.f[m[0]][m[1]].visited === 0) {
												
						layer.push([m[0],m[1],cell[2]+1]);						
						field.f[m[0]][m[1]].visited = 1;						
					}					
				}				
			}	

			
			
		}

	}

}

game = {
	
	opponent : {},
	selected : null,
	sel_cell :{},
	sel_cell_wall_iter : [0,0],
	field : {},
	pending_wall : {},
	pending_field :{},
	av_moves: [],
	
	async activate(role, opponent) {
					
		//если это переход из бот игры
		if (state === 'b') {
			this.opponent.silent_stop();
		}
			

		//если открыт чат то закрываем его
		if (objects.chat_cont.visible===true)
			chat.close();
				
		
		//если открыт просмотр игры
		if (game_watching.on===true)
			game_watching.close();
		
		//если открыт туториал
		if (game_tutor.on)
			game_tutor.close();
		
		//включаем кнопки так как они были отключены в туториале
		objects.move_confirm_button.interactive=true;
		objects.move_decline_button.interactive=true;
		
		//это если обработка стен
		this.stop_wall_processing();
				
		my_role=role;
		this.opponent = opponent;
		
		if (my_role === 'master') {
			my_turn = 1;			
			objects.timer.x=80;		
			message.add(['Вы ходите первым. Последний ход за соперником.','You go first. The last move is for the opponent'][LANG]);

		} else {
			my_turn = 0;			
			objects.timer.x=720;
			message.add(['Вы ходите вторым. Последний ход за Вами.','You go second. The last move is yours'][LANG])
		}
		
		objects.my_icon.texture = gres['chip'+my_data.chip].texture;
		objects.opp_icon.tint=0x88ff88;
		
		//это то что могло остаться от игры с ботом
		objects.move_opt_cont.visible=false;
		objects.my_icon.alpha=1;
		some_process.player_selected_processing = function(){};
				
		//инициируем все что связано с оппонентом
		await this.opponent.init(my_role);
				
		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
				
		//воспроизводим звук о начале игры
		gres.game_start.sound.play();
				
		//восстанавливаем мое имя так как оно могло меняться
		make_text(objects.my_card_name,my_data.name,150);
		objects.my_card_rating.text = my_data.rating;
				
		//показываем карточки игроков		
		objects.my_card_cont.visible = true;
		objects.opp_card_cont.visible = true;		
		
		//отключаем взаимодейтсвие с доской
		objects.field.pointerdown = this.mouse_down.bind(game);		
			
		//формируем игровое поле
		ffunc.init(this.field);	

		//показываем игровое поле
		objects.field.visible = true;		
				
		//показыаем таймер
		objects.timer.visible=true;
		
	

		//обозначаем какой сейчас ход
		made_moves = 0;
		objects.cur_move_text.visible = true;
		objects.cur_move_text.text=['Ход: ','Move: '][LANG] + made_moves;
				
		//количество стен
		this.wall_num = [10,10];
		objects.my_walls.text = ['Стены: ','Walls: '][LANG]+this.wall_num[0];
		objects.opp_walls.text = ['Стены: ','Walls: '][LANG]+this.wall_num[1];
		
		//плавно добавляем фигуры
		objects.my_icon.x = objects.field.x + FIELD_MARGIN + 4 * 50;
		objects.opp_icon.x = objects.field.x + FIELD_MARGIN + 4 * 50;
		
		anim2.add(objects.my_icon,{y:[450, 400]}, true, 0.5,'linear');	
		await anim2.add(objects.opp_icon,{y:[-50, 0]}, true, 0.5,'linear');	
		
		//обновляем поле
		ffunc.draw(this.field)			
		
	},
		
	async stop(result) {
						
		//отключаем взаимодейтсвие с доской
		objects.field.pointerdown = function() {};
		
		//отключаем процессинги
		some_process.player_selected_processing = function(){};
		some_process.wall_processing = function(){};	


		//включаем запрет входящих ходов - это также остановит расчет бота если он идет
		this.opponent.no_incoming_move = 1;
				
		objects.move_buttons_cont.visible = false;
				
		//сначала завершаем все что связано с оппонентом
		await this.opponent.stop(result);		
						
		objects.timer.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.field.visible = false;
		objects.walls.forEach(w=>{w.visible=false});
		objects.my_icon.visible = false;
		objects.opp_icon.visible = false;
		objects.h_wall.visible = false;
		objects.v_wall.visible = false;
		
		objects.cur_move_text.visible = false;
		
		//убираем ходы если они остались
		this.show_my_moves(0);
				
		opp_data.uid = '';
						
		//показыаем рекламу		
		ad.show();
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'o'});		
		
		main_menu.activate();
			
	},
	
	giveup_down() {
		
		
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true) {
			gres.bad_move.sound.play();
			return;			
		}
		
		//отправляем сопернику что мы сдались
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"GIVEUP",tm:Date.now()});
		this.stop('my_giveup')
		
		
	},
	
	stop_down() {
		
		
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true) {
			gres.bad_move.sound.play();
			return;			
		}
		
		this.stop('my_stop')		
		
	},
	
	async mouse_down(e) {
		
		if (my_turn === 0) {
			message.add(['Не твоя очередь','Not you turn'][LANG])
			return;
		}
				
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true || objects.req_cont.visible === true || objects.my_icon.ready === false) {
			gres.bad_move.sound.play();
			return;			
		}
		
		//координаты указателя
		let mx = e.data.global.x/app.stage.scale.x;
		let my = e.data.global.y/app.stage.scale.y;

		//координаты указателя на игровой доске
		const _c = Math.floor(9*(mx-objects.field.x-FIELD_MARGIN)/450);
		const _r = Math.floor(9*(my-objects.field.y-FIELD_MARGIN)/450);
		const _id = _c + _r * 8;
		let p = this.field.pos[MY_ID]; p ={r:p.r, c:p.c};
		
		const player_cell_selected = (p.r === _r && p.c === _c);
		
		//выбрана ячейка с игроком
		if (player_cell_selected === true  && this.selected === null) {			
						
			gres.checker_tap.sound.play();
			
			//если происходит строительство стены то отменяем
			if (objects.move_buttons_cont.visible === true)
				this.decline_move();
					
			this.selected = 'me';	
			this.show_my_moves(1);		
			
			//обработка состояния когда выделен игрок
			some_process.player_selected_processing=this.player_selected_processing;			
			return;
		} 		
				
		//Если игрок уже выбран и клетка другая - проверяем и перемещаем
		if (this.selected === 'me') {
					
			//опять нажали на ту же ячейку
			if (player_cell_selected === true) {
				this.selected = null;				
				this.show_my_moves(0);					
				return;
			}
						
			//выбрали новую ячейку - проверяем можно или нет
			let s_move =_r.toString() + _c.toString();
			if (!this.av_moves.includes(s_move)) {
				message.add(['Сюда нелья ходить','Invalid move'][LANG]);
				return;				
			}

			gres.checker_tap.sound.play();			
						
			//убираем выделение
			this.selected = null;

			//убираем варианты движения
			this.show_my_moves(0);	
			
			//плавно переставляем и ждем завершения
			await this.update_player_pos(objects.my_icon, p.r, p.c, _r, _c);	
			
			//обновляем движение на поле
			ffunc.make_move(this.field, p.r, p.c, _r , _c )
			
			//обновляем поле
			ffunc.draw(this.field);			
								
			//отправляем ход сопернику перевернув			
			this.process_move({type: 'move',r0 : 8 - p.r, c0 : 8 - p.c, r1: 8 - _r, c1: 8 - _c});
			return;
		}
		
		//выбрали пустую ячейку для строительства стены
		if (player_cell_selected === false) {
			
			if (this.field.pos[MY_ID].walls === 0) {
				message.add(['Больше построить стену нельзя','You have no walls'][LANG]);
				return;
			}
			
			this.sel_cell={r: _r, c: _c};		
			
			const wall_ok = this.show_wall_opt();
			if (wall_ok === 1) {
				objects.move_buttons_cont.visible = true;				
				some_process.wall_processing=this.wall_processing;	
			}

		}		
	
	},
	
	player_selected_processing() {
		
		objects.my_icon.alpha = Math.abs(Math.sin(game_tick * 5));
		
	},
	
	wall_processing () {
		
		if (objects.h_wall.visible === true)
			objects.h_wall.alpha = Math.abs(Math.sin(game_tick * 5));
		if (objects.v_wall.visible === true)
			objects.v_wall.alpha = Math.abs(Math.sin(game_tick * 5));
	},
	
	async update_player_pos(sprite, r1, c1, r2, c2) {
		
		let x1 = objects.field.x + FIELD_MARGIN + c1 * 50;
		let y1 = objects.field.y + FIELD_MARGIN + r1 * 50;
		let x2 = objects.field.x + FIELD_MARGIN + c2 * 50;
		let y2 = objects.field.y + FIELD_MARGIN + r2 * 50;
					
		await anim2.add(sprite,{x:[x1, x2],y:[y1,y2]}, true, 0.25,'linear');
		sprite.alpha = 1;
		
	},
	
	confirm_move  () {
		
		//короткое обращение
		let pw = this.pending_wall;
			
		
		//создаем поле для проверки блокировки оппонента и игрока
		let pf = JSON.parse(JSON.stringify(this.field));
		pf.f[pw.r][pw.c].wall_type = pw.wall_type;
		
		if (ffunc.blocked_way(pf, pf.pos[OPP_ID].r, pf.pos[OPP_ID].c, ROW8, 1) === 1) {
			message.add(['Нельзя полностью блокировать соперника','Cannot completely block opponent'][LANG]);
			return;
		}	
		
		pf = JSON.parse(JSON.stringify(this.field));
		pf.f[pw.r][pw.c].wall_type = pw.wall_type;
		
		if (ffunc.blocked_way(pf, pf.pos[MY_ID].r, pf.pos[MY_ID].c, ROW0, 1) === 1) {
			message.add(['Так у вас не будет пути до финиша','So you wanna block yourself?'][LANG]);
			return;
		}
		
		gres.place_wall.sound.play();
		const tar_cell=this.field.f[pw.r][pw.c];
		tar_cell.wall_type = pw.wall_type;
		tar_cell.wall_owner = MY_ID;
		
		
		//уменьшаем кол-во стен
		this.field.pos[MY_ID].walls--;
		objects.my_walls.text = ['Стены: ','Walls: '][LANG]+this.field.pos[MY_ID].walls;	
		
		//отправляем ход сопернику перевернув
		this.process_move({type: 'wall', r: 9 - pw.r, c: 9 - pw.c, wall_type: pw.wall_type});
				
		pw.sprite.visible = false;
		
		//обновляем поле
		ffunc.draw(this.field);
		
		//и как бы отменяем все
		this.stop_wall_processing();
		
	},
	
	process_move(data) {
				
		//отправляем ход сопернику
		this.opponent.send_move(data);					
	
		this.wall_to_try=V_WALL;
	
		if (my_role === 'slave') {			
			made_moves++;
			objects.cur_move_text.text=['Ход: ','Made moves: '][LANG] + made_moves;
			let end_state = this.get_game_state();			
			if (end_state !== 'none') {
				this.stop(end_state)
				return;				
			}
		}
		
		
		my_turn = 0;
		me_conf_play = 1;	
		this.opponent.reset_timer();	

		
		//обозначаем что я сделал ход и следовательно подтвердил согласие на игру
		this.opponent.me_conf_play=1;
		
		//перемещаем табло времени
		objects.timer.x = 720;
		
	},	
	
	get_game_state  () {
		
			
		if ( this.field.pos[MY_ID].r === ROW0 && this.field.pos[OPP_ID].r !== ROW8 )
			return 'my_finished_first';			
		if ( this.field.pos[MY_ID].r === ROW0 && this.field.pos[OPP_ID].r === ROW8 )
			return 'both_finished';				
		if (this.field.pos[MY_ID].r !== ROW0 && this.field.pos[OPP_ID].r === ROW8)
			return 'opp_finished_first';	

		if (made_moves >= MAX_MOVES) {
			
			let my_score = 8 - this.field.pos[MY_ID].r;
			let opp_score = this.field.pos[OPP_ID].r
			
			if (my_score > opp_score)
				return 'my_closer_after_80';				
			if (my_score < opp_score)
				return 'opp_closer_after_80';	
			if (my_score === opp_score)
				return 'both_closer_80';	
		}
		
		return 'none';

				
	},
	
	decline_move () {		
		
		//воспроизводим звук
		game_res.resources.cancel_wall.sound.play();
		this.wall_to_try=V_WALL;
		this.stop_wall_processing();
		
	},
	
	stop_wall_processing () {
		
		objects.h_wall.visible = false;
		objects.v_wall.visible = false;
		this.sel_cell_wall_iter = [0,0];
		objects.move_buttons_cont.visible = false;
		some_process.wall_processing = function(){};
	},
			
	show_wall_opt(id) {
		
		objects.h_wall.visible=false;
		objects.v_wall.visible=false;
		
		gres.iter_wall.sound.play();
					
		//тип стены
		//c смещение
		//r смещение
		//следующая ячейка
		let p = [[V_WALL,0,0,1],[H_WALL,0,0,2],[H_WALL,0,1,3],[V_WALL,0,1,4],[V_WALL,1,1,5],[H_WALL,1,1,6],[H_WALL,1,0,7],[V_WALL,1,0,0]]
		
		if (this.sel_cell_wall_iter[0] !== id) {
			this.sel_cell_wall_iter[0] = id;
			this.sel_cell_wall_iter[1] = 0;	
			
			//убираем кнопку подтверждения так как пока не понятно найдутся ли стены для данной ячейки
			objects.move_buttons_cont.visible = false;
		}
		
		let g_pos = this.sel_cell_wall_iter[1];
		
		for (let i = 0 ; i < 8 ; i++) {
			
			let wp = p[g_pos];			
			
			if (this.sel_cell_wall_iter[1] === g_pos) {
								
				let r = this.sel_cell.r + wp[1];								
				let c = this.sel_cell.c + wp[2];
				
				
				this.sel_cell_wall_iter[1]++;
				if (this.sel_cell_wall_iter[1] > 7)
					this.sel_cell_wall_iter[1] = 0;	
				
				//console.log(r,c,wp[0]);												
				//если стену нельзя поставить выбираем следующую конфигурацию								
				let check = ffunc.check_new_wall(this.field, r, c, wp[0])
				if (check ===0) {
					g_pos= p[g_pos][3];
					continue;
				}

				//если все проверки прошли то отображаем стену
				let w_spr = {};
				
				if (wp[0] === V_WALL) {					
					w_spr = objects.v_wall;
					w_spr.texture=gres.v_wall.texture;					
				}
				
				if (wp[0] === H_WALL) {					
					w_spr = objects.h_wall;
					w_spr.texture=gres.h_wall.texture;				
				}
								
				w_spr.visible = true;
				w_spr.y = r * 50 + objects.field.y + FIELD_MARGIN;				
				w_spr.x = c * 50 + objects.field.x + FIELD_MARGIN;

				this.pending_wall = {r: r, c: c, wall_type: wp[0], sprite: w_spr};
				
				return 1;
			}			
		}
		
		return 0;	
	},
			
	show_my_moves(show) {
				
		if (show===0) {
			objects.move_opt_cont.visible=false;
			objects.my_icon.alpha=1;
			some_process.player_selected_processing = function(){};
			return;			
		}
				
		//сначала убираем все подсветки
		objects.move_opt.forEach(m => m.visible = false);		
				
		objects.move_opt_cont.visible=true;
		this.av_moves=[];		
		let moves = ffunc.get_moves(this.field, MY_ID);
				
		for (let i = 0 ; i < moves.length ; i++) {
			
			objects.move_opt[i].visible = true;						
			objects.move_opt[i].x = objects.field.x + FIELD_MARGIN + moves[i].c1 * 50;
			objects.move_opt[i].y = objects.field.y + FIELD_MARGIN + moves[i].r1 * 50;			
			this.av_moves.push(moves[i].r1.toString() + moves[i].c1.toString());			
		}

	},
	
	async receive_move(data) {
		
		if (data.type === 'move') {
			
			gres.checker_tap.sound.play();
			let p = this.field.pos[OPP_ID];			
			await this.update_player_pos(objects.opp_icon, data.r0, data.c0, data.r1, data.c1);			
			ffunc.make_move(this.field, data.r0, data.c0, data.r1, data.c1)
			gres.checker_tap.sound.play();
		}
		
		if (data.type === 'wall') {
			
			game_res.resources.place_wall.sound.play();
			
			//устанаваем полученную стену в наше поле
			const tar_cell=this.field.f[data.r][data.c];
			tar_cell.wall_type = data.wall_type;
			tar_cell.wall_owner = OPP_ID;
			
			//обновляем кол-во стен
			this.field.pos[OPP_ID].walls--;
			objects.opp_walls.text = ['Стены: ','Walls: '][LANG] + this.field.pos[OPP_ID].walls;
		}
						
		ffunc.draw(this.field); 
				
		if (my_role === 'master') {			
			made_moves++;
			objects.cur_move_text.text=['Ход: ','Made moves: '][LANG] + made_moves;
			let end_state = this.get_game_state();			
			if (end_state !== 'none') {
				this.stop(end_state)
				return;				
			}		
		}
		
		my_turn = 1;
		this.opponent.opp_conf_play = 1;
		this.opponent.reset_timer();		
		
		//уведомление что игра скоро закончиться
		if (made_moves>(MAX_MOVES-5)) {
			message.add([`После ${MAX_MOVES} хода выиграет тот кто ближе к цели`,`After ${MAX_MOVES} move the one who is closer to the goal will win`][LANG]);
		}
		
		//перемещаем табло времени
		objects.timer.x = 80;
		
	}

}

game_watching={
	
	game_id:0,
	field:{},
	on:false,
	anchor_uid:'',
	
	async activate(card_data){
		
		this.on=true;
		ffunc.init(this.field);	
		objects.field.visible = true;	
		objects.my_icon.visible = true;	
		objects.opp_icon.visible = true;	
		objects.stop_gw_button.visible = true;	
		
		this.anchor_uid=card_data.uid1;
		
		this.game_id=card_data.game_id;
		
		
		//показываем карточки игроков		
		objects.my_card_cont.visible = true;
		objects.opp_card_cont.visible = true;	
		
		//получаем остальные данные об игроке
		let snapshot = await firebase.database().ref('players/'+card_data.uid1+'/chip').once('value');
		let chip1 = snapshot.val()||0;
		
		snapshot = await firebase.database().ref('players/'+card_data.uid2+'/chip').once('value');
		let chip2 = snapshot.val()||0;
			
		
		//фишки
		
		//это если фишки совпадают
		if (chip1===chip2)
			objects.picon1.tint=objects.opp_icon.tint=0x88ff88;
		else
			objects.picon1.tint=objects.opp_icon.tint=0xffffff;
		
		objects.my_icon.texture =objects.picon0.texture=gres['chip'+chip1].texture;
		objects.opp_icon.texture =objects.picon1.texture=gres['chip'+chip2].texture;
		
		objects.picon0.visible=objects.picon1.visible=true;
		
		//аватарки		
		objects.my_avatar.texture=card_data.avatar1.texture;
		objects.opp_avatar.texture=card_data.avatar2.texture;
		
		//имена
		make_text(objects.my_card_name,card_data.name1,150);
		make_text(objects.opp_card_name,card_data.name2,150);
		
		//рейтинги
		objects.my_card_rating.text=card_data.rating_text1.text;
		objects.opp_card_rating.text=card_data.rating_text2.text;

		
		firebase.database().ref("tables/"+this.game_id).on('value',(snapshot) => {
			game_watching.new_move(snapshot.val());
		})
		
	},
	
	get_inverted_board(board){
		
		
	},
	
	stop_and_return(){
		this.close();
		cards_menu.activate();		
	},
	
	async new_move(data){
		
		if(data===null || data===undefined)
			return;
		
		if(data.fin_flag){
			await big_message.show("This game is finished",")))");
			this.stop_and_return();
			return;
		}
		
		
		//обновляем доску
		let data_str="";
		let i=0;
		
		ffunc.init(this.field);	
		for (let r = 0; r < 9; r++ ){
			for (let c = 0; c < 9; c++ ){
				const wall_type=+data.f_str[i];					
				if (wall_type>0) {
					
					if(data.uid===this.anchor_uid){			
						this.field.f[r][c].wall_type=wall_type;		
						this.field.f[r][c].wall_owner=0;	
					} else {
						this.field.f[9-r][9-c].wall_type=wall_type;	
						this.field.f[9-r][9-c].wall_owner=0;	
					}						
				}
				i++;
			}		
		}


		for (let r = 0; r < 9; r++ )
			for (let c = 0; c < 9; c++ )		
				this.field.f[r][c].player=0;
		
		const my_r=+data.f_str[i++];
		const my_c=+data.f_str[i++];
		
		const opp_r=+data.f_str[i++];
		const opp_c=+data.f_str[i++];
		
		const chunks = data.f_str.split(',');
		const walls_num1=+chunks[1];
		const walls_num2=+chunks[2];		
		
		
		if(data.uid===this.anchor_uid){
			this.field.f[my_r][my_c].player=MY_ID;
			this.field.f[opp_r][opp_c].player=OPP_ID;	
			objects.my_walls.text = ['Стены: ','Walls: '][LANG]+walls_num1;
			objects.opp_walls.text = ['Стены: ','Walls: '][LANG]+walls_num2;
			
		} else {
			this.field.f[8-my_r][8-my_c].player=OPP_ID;
			this.field.f[8-opp_r][8-opp_c].player=MY_ID;			
			objects.opp_walls.text = ['Стены: ','Walls: '][LANG]+walls_num1;
			objects.my_walls.text = ['Стены: ','Walls: '][LANG]+walls_num2;
		}

		ffunc.draw(this.field); 
		
	},
	
	close(){
		
		objects.field.visible = false;	
		objects.my_icon.visible = false;	
		objects.opp_icon.visible = false;	
		objects.my_card_cont.visible = false;
		objects.stop_gw_button.visible = false;	
		objects.opp_card_cont.visible = false;	
		objects.walls.forEach(w=>{w.visible=false});
		objects.picon0.visible=objects.picon1.visible=false;
		firebase.database().ref("tables/"+this.game_id).off();
		objects.my_avatar.texture=my_data.my_texture;
		this.on=false;

	}
	
}

game_tutor={

	time:0,
	timeline:[],	
	next_frame:0,
	resolver:0,
	on:0,
		
	async start(){		


		//ссылки на стены
		for(let w=0;w<6;w++){
			objects['w'+w]=objects.walls[w];			
			objects['w'+w].scale_xy=0.6666666;
		}
		
		const d1=await fetch('timeline.txt')
		const d2=await d1.text();
		this.timeline=eval(d2);
		
		this.on=1;
		
		objects.my_icon.texture = gres['chip4'].texture;
		objects.opp_icon.texture = gres['chip5'].texture;
		
		//это то что могло остаться от игры с ботом
		objects.move_opt_cont.visible=false;
		objects.stop_bot_button.visible=true;
		objects.stop_bot_button.pointerdown=function(){game_tutor.stop()};
		some_process.player_selected_processing = function(){};
		
		objects.move_confirm_button.interactive=false;
		objects.move_decline_button.interactive=false;
											
		//показываем карточки игроков		
		objects.my_card_cont.visible = true;
		objects.my_card_name.text=['Игрок 1', 'Player 1'][LANG];
		objects.my_avatar.texture=gres['chip4'].texture;
		objects.my_card_rating.text='-';
		
		objects.opp_card_cont.visible = true;		
		objects.opp_card_name.text=['Игрок 2', 'Player 2'][LANG];
		objects.opp_avatar.texture=gres['chip5'].texture;
		objects.opp_card_rating.text='-';
		
		//отключаем взаимодейтсвие с доской
		objects.field.pointerdown = null;		
			
		//формируем игровое поле
		ffunc.init(game.field);	

		//показываем игровое поле
		objects.field.visible = true;		
				
		//убираем таймер
		objects.timer.visible=false;		

				
		//количество стен
		this.wall_num = [10,10];
		objects.my_walls.text = ['Стены: ','Walls: '][LANG]+this.wall_num[0];
		objects.opp_walls.text = ['Стены: ','Walls: '][LANG]+this.wall_num[1];
		
		//плавно добавляем фигуры
		objects.my_icon.x = objects.field.x + FIELD_MARGIN + 4 * 50;
		objects.my_icon.r=8;
		objects.my_icon.c=4;
		
		objects.opp_icon.x = objects.field.x + FIELD_MARGIN + 4 * 50;
		objects.opp_icon.r=0;
		objects.opp_icon.c=4;
		
		anim2.add(objects.my_icon,{y:[450, 400]}, true, 0.5,'linear');	
		anim2.add(objects.opp_icon,{y:[-50, 0]}, true, 0.5,'linear');	
		
		//обновляем поле
		ffunc.draw(game.field)		
		
		this.time=0;
		this.next_frame=0;
		some_process.tutor=function(){game_tutor.run()};
				
	},
	
	stop(){
		
		if (anim2.any_on()) return;
		
		this.close();
		main_menu.activate();		
		
	},
	
	async run(){
				
		const next_frame_time=this.timeline[this.next_frame]?.[0]||9999999999;
		
		if (this.time>next_frame_time){
			const frame_data=this.timeline[this.next_frame][1];
			for (let frame of frame_data){
				
				if (frame){
					
					if (frame.type==='anim'){
						const obj_name=frame.obj;
						const time=frame.time;
						const params=frame.params;
						const func=frame.func;
						const vis_on_end=frame.vis_on_end;
						anim2.add(objects[obj_name],params,vis_on_end,time,func);						
					}	
					
					if (frame.type==='event'){
						const obj=frame.obj;
						const params=frame.params;
						for (let p in params){							
							const val=params[p];
							if (p==='texture')
								objects[obj][p]=gres[val].texture;
							else
								objects[obj][p]=val;							
						}						
					}		

					if (frame.type==='func'){
						frame.f();						
					}	
									
					if (frame.type==='wait'){
						
						some_process.tutor=function(){};
						await new Promise(resolve=>{
							this.resolver=resolve;
						}).finally(()=>{
							objects.tutor_arrow.visible=false;
							objects.tutor_text.visible=false;			
							objects.tutor_text_bcg.visible=false;	
							some_process.tutor=function(){game_tutor.run()};
						});	
					
					}
				}				
			}
			this.next_frame++;
		}
		
		this.time+=0.016666666;
	},
	
	show_text(x,y,t){
		
		objects.tutor_text_bcg.visible=true;
		objects.tutor_text.visible=true;		
		
		objects.tutor_text_bcg.x=x;
		objects.tutor_text_bcg.y=y;

		objects.tutor_text.x=x;
		objects.tutor_text.y=y-20;
		
		objects.tutor_text.text=t;
		
	},
	
	close(){
		this.on=0;
		some_process.tutor=function(){};
		objects.move_buttons_cont.visible=false;
		objects.stop_bot_button.visible=false;
		objects.tutor_text_bcg.visible=false;
		objects.hand.visible=false;
		objects.tutor_text.visible=false;	
		objects.tutor_arrow.visible=false;	
		objects.my_card_cont.visible = false;
		objects.opp_card_cont.visible = false;
		objects.move_opt_cont.visible=false;
		objects.my_icon.visible=false;
		objects.opp_icon.visible=false;
		objects.field.visible = false;	
		objects.walls.forEach(w=>w.visible=false)
		
	}
	
}

keep_alive = function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref(room_name+'/'+my_data.uid).remove();
		return;		
	}

	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(room_name+'/'+my_data.uid).onDisconnect().remove();

	set_state({});
}

process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		game_id=msg.game_id;
		start_word=msg.start_word;
		cards_menu.accepted_invite();
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player===msg.sender) {
		cards_menu.rejected_invite();
	}

	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==="REFUSE")
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==="CONF")
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);

			//получение сообщение об отмене игры
			if (msg.message==="OPP_CANCEL" )
				game.stop('OPP_CANCEL');
								
			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				game.receive_move(msg.data);
			
			//получение сообщения о сдаче
			if (msg.message==="GIVEUP")
				game.stop("opp_giveup");
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}
}

req_dialog={
	
	_opp_data : {} ,
	
	show(uid) {		

		firebase.database().ref("players/"+uid).once('value').then((snapshot) => {

			//не показываем диалог если мы в игре
			if (state === 'p')
				return;

			player_data=snapshot.val();

			//показываем окно запроса только если получили данные с файербейс
			if (player_data===null) {
				//console.log("Не получилось загрузить данные о сопернике");
			}	else	{


				gres.invite.sound.play();
				
				
				//так как успешно получили данные о сопернике то показываем окно	
				anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.5,'easeOutElastic');

				//Отображаем  имя и фамилию в окне приглашения
				req_dialog._opp_data.name=player_data.name;
				make_text(objects.req_name,player_data.name,200);
				objects.req_rating.text=player_data.rating;
				req_dialog._opp_data.rating=player_data.rating;

				//throw "cut_string erroor";
				req_dialog._opp_data.uid=uid;

				//загружаем фото
				this.load_photo(player_data.pic_url);

			}
		});
	},

	load_photo: function(pic_url) {


		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//console.log("Загружаем текстуру "+objects.mini_cards[id].name)
			var loader = new PIXI.Loader();
			loader.add("inv_avatar", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			});
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log("Ставим из кэша "+objects.mini_cards[id].name)
			objects.req_avatar.texture=PIXI.utils.TextureCache[pic_url];
		}

	},

	reject: function() {

		if (objects.req_cont.ready===false)
			return;
		
		gres.click.sound.play();

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');
		
		
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept: function() {
				
		if (objects.req_cont.ready===false || objects.rules_cont.visible===true ) {
			gres.bad_move.sound.play();
			return;			
		}
		
		//только когда бот сделал ход
		if (state ==='b' && my_turn === 0)
			return;
				
		gres.click.sound.play();
		
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

				
		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*9999);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),game_id:game_id});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		game.activate("slave" , online_game );

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');
	}

}

ad={
			
	show : function() {
		
		if (game_platform==="YANDEX") {			
			//показываем рекламу
			window.ysdk.adv.showFullscreenAdv({
			  callbacks: {
				onClose: function() {}, 
				onError: function() {}
						}
			})
		}
		
		if (game_platform==="VK") {
					 
			vkBridge.send("VKWebAppShowBannerAd", {banner_location:'top'})
			.then(data => console.log(data.result))
			.catch(error => console.log(error));	
		}		

		if (game_platform==="MY_GAMES") {
					 
			my_games_api.showAds({interstitial:true});
		}			
		
		if (game_platform==='CRAZYGAMES') {
			const callbacks = {
				adFinished: () => console.log("End midgame ad (callback)"),
				adError: (error) => console.log("Error midgame ad (callback)", error),
				adStarted: () => console.log("Start midgame ad (callback)"),
			};
			window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);		
		}
		
		if (game_platform==='GOOGLE_PLAY') {
			if (typeof Android !== 'undefined') {
				Android.showAdFromJs();
			}			
		}
	},
	
	show2 : async function() {
		
		
		if (game_platform ==="YANDEX") {
			
			let res = await new Promise(function(resolve, reject){				
				window.ysdk.adv.showRewardedVideo({
						callbacks: {
						  onOpen: () => {},
						  onRewarded: () => {resolve('ok')},
						  onClose: () => {resolve('err')}, 
						  onError: (e) => {resolve('err')}
					}
				})
			
			})
			return res;
		}
		
		if (game_platform === "VK") {	

			let res = '';
			try {
				res = await vkBridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
			}
			catch(error) {
				res ='err';
			}
			
			return res;				
			
		}	
		
		return 'err';
		
	}
}

stickers={
	
	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel: function() {

		
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true || objects.stickers_cont.ready===false) {
			gres.bad_move.sound.play();
			return;			
		}

	
		
		game_res.resources.click.sound.play();


		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy]}, true, 0.5,'easeOutBack');

	},

	hide_panel: function() {

		//game_res.resources.close.sound.play();

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	send : async function(id) {

		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true || objects.stickers_cont.ready===false) {
			gres.bad_move.sound.play();
			return;			
		}
		
		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		message.add(['Стикер отправлен сопернику','Sticker was sent to the opponent'][LANG]);

		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		
		await anim2.add(objects.sent_sticker_area,{alpha:[0, 0.5]}, true, 0.5,'linear');
		
		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_send = resolve;
				setTimeout(resolve, 2000)
			}
		);
		
		if (res === "forced")
			return;

		await anim2.add(objects.sent_sticker_area,{alpha:[0.5, 0]}, false, 0.5,'linear');
	},

	receive: async function(id) {

		
		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive("forced");

		//воспроизводим соответствующий звук
		sound.play('receive_sticker');

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
	
		await anim2.add(objects.rec_sticker_area,{x:[-150, objects.rec_sticker_area.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_recive = resolve;
				setTimeout(resolve, 2000)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.rec_sticker_area,{x:[objects.rec_sticker_area.sx, -150]}, false, 0.5,'easeInBack');

	}

}

main_menu={

	logo_dx : 0.2,
	chip_id:0,
	
	activate: function() {


		

		//просто добавляем контейнер с кнопками
		objects.desktop.texture=gres.desktop.texture;
		//objects.desktop.visible = true;
		anim2.add(objects.tile,{alpha: [0,1]}, true, 0.5,'linear');
		
		//anim2.add(objects.maze_logo_top,{alpha: [0,1]}, true, 1,'easeInOutCubic');
		anim2.add(objects.maze_logo,{alpha: [0,1],y:[-200, objects.maze_logo.sy]}, true, 1,'linear');
		anim2.add(objects.main_buttons_cont,{y:[450, objects.main_buttons_cont.sy],alpha: [0,1]}, true, 0.75,'linear');
		
		some_process.maze_logo_move = this.process.bind(this);

	},	

	close : async function() {

	

		anim2.add(objects.maze_logo,{alpha: [1,0]}, false, 0.5,'linear');
		anim2.add(objects.main_buttons_cont,{y:[ objects.main_buttons_cont.y, 450],alpha: [1,0]}, true, 0.5,'linear');
		await anim2.add(objects.tile,{alpha: [1,0]}, false, 0.5,'linear');
		some_process.maze_logo_move = function(){};

	},

	play_button_down: async function () {

		if (objects.big_message_cont.visible === true || objects.id_cont.visible === true || objects.req_cont.visible === true ||  objects.main_buttons_cont.ready === false) {
			gres.bad_move.sound.play();
			return;			
		}


		sound.play('click');

		await this.close();
		cards_menu.activate();

	},

	lb_button_down: function () {

		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true ||  objects.main_buttons_cont.ready === false) {
			gres.bad_move.sound.play();
			return;			
		}

		sound.play('click');

		this.close();
		lb.show();

	},

	rules_button_down: function () {

		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true ||  objects.main_buttons_cont.ready === false ||  objects.rules_cont.ready === false) {
			sound.play('bad_move');
			return;			
		}
		
		sound.play('click');
		
		//отображаем текущую фищку
		this.chip_id=my_data.chip;
		objects.chip_sel_frame.x=objects.chip_icons[my_data.chip].x-10;
		objects.chip_sel_frame.y=objects.chip_icons[my_data.chip].y-10;
	
		anim2.add(objects.rules_cont,{y:[-450, objects.rules_cont.sy]}, true, 0.5,'easeOutBack');

	},

	tutor_button_down(){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		this.close();
		game_tutor.start();
		
	},

	rules_ok_down: function () {
		
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true ||  objects.rules_cont.ready === false) {
			sound.play('bad_move');
			return;			
		}
		
		sound.play('click');
		
		//фиксируем номер фишки если поменялся
		if (my_data.chip!==this.chip_id){
			my_data.chip=this.chip_id;
			firebase.database().ref('players/'+my_data.uid+'/chip').set(my_data.chip);			
		}
		
		anim2.add(objects.rules_cont,{y:[objects.rules_cont.y,-450, ]}, false, 0.5,'easeInBack');
	},
	
	chip_down(){
		
		sound.play('click');		
		objects.chip_sel_frame.x=this.x-10;
		objects.chip_sel_frame.y=this.y-10;
		main_menu.chip_id=this.chip_id;		
	},
	
	chat_button_down : async function() {
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		
		chat.activate();
		
		
	},
	
	process : function () {
		
		//objects.tile.tileScale.x = objects.tile.tileScale.y = 2 + Math.sin(game_tick * 0.2);

		objects.tile.tilePosition.x += Math.sin(game_tick * 0.2)*2;
		objects.tile.tilePosition.y += Math.cos(game_tick * 0.3)*2;

	}

}

chat={
	
	MESSAGE_HEIGHT : 75,
	last_record_end : 0,
	drag : false,
	data:[],
	touch_y:0,
	
	activate : function() {
		
		//firebase.database().ref('chat').remove();
		//return;
		
		objects.desktop.visible=true;
		objects.desktop.pointerdown=this.down.bind(this);
		objects.desktop.pointerup=this.up.bind(this);
		objects.desktop.pointermove=this.move.bind(this);
		objects.desktop.interactive=true;
		
		this.last_record_end = 0;
		objects.chat_records_cont.y = objects.chat_records_cont.sy;
		
		for(let rec of objects.chat_records) {
			rec.visible = false;			
			rec.msg_id = -1;	
			rec.tm=0;
		}

		objects.chat_enter_button.visible=true
		
		objects.chat_cont.visible = true;
		//подписываемся на чат
		//подписываемся на изменения состояний пользователей
		firebase.database().ref('chat2').orderByChild('tm').limitToLast(20).once('value', snapshot => {chat.chat_load(snapshot.val());});		
		firebase.database().ref('chat2').on('child_changed', snapshot => {chat.chat_updated(snapshot.val());});
	},
	
	down : function(e) {
		
		this.drag=true;
        this.touch_y = e.data.global.y / app.stage.scale.y;
	},
	
	up : function(e) {
		
		this.drag=false;
		
	},
	
	move : function(e) {
		
		if (this.drag === true) {
			
			let cur_y = e.data.global.y / app.stage.scale.y;
			let dy = this.touch_y - cur_y;
			if (dy!==0){
				
				objects.chat_records_cont.y-=dy;
				this.touch_y=cur_y;
				this.wheel_event(0);
			}
			
		}
		
	},
				
	get_oldest_record : function () {
		
		let oldest = objects.chat_records[0];
		
		for(let rec of objects.chat_records)
			if (rec.tm < oldest.tm)
				oldest = rec;			
		return oldest;

	},
	
	shuffle_array : function(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	},
	
	get_oldest_index : function () {
		
		let nums=Array.from(Array(50).keys());
		this.shuffle_array(nums);
		loop1:for (let num of nums){
			
			for(let rec of objects.chat_records)
				if (rec.visible===true && rec.msg_index===num)
					continue loop1;
			return num;
		}
		
		let oldest = {tm:9671801786406 ,visible:true};		
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;	
		return oldest.msg_index;		
		
	},
		
	chat_load : async function(data) {
		
		if (data === null) return;
		
		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);
		
		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});
			
		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c);	
	},	
		
	chat_updated : async function(data) {		
	
		if(data===undefined) return;
		
		//если это сообщение уже есть в чате
		var result = objects.chat_records.find(obj => {
		  return obj.msg_id === data.msg_id;
		})
		
		if (result !== undefined)		
			return;
		
		let rec = objects.chat_records[data.msg_index];
		
		//сразу заносим айди чтобы проверять
		rec.msg_id = data.msg_id;
		
		rec.y = this.last_record_end;
		
		await rec.set(data)		
		
		this.last_record_end += this.MESSAGE_HEIGHT;		
		
		
		await anim2.add(objects.chat_records_cont,{y:[objects.chat_records_cont.y,objects.chat_records_cont.y-this.MESSAGE_HEIGHT]}, true, 0.05,'linear');		
		
	},
	
	wheel_event : function(delta) {
		
		objects.chat_records_cont.y-=delta*this.MESSAGE_HEIGHT;	
		const chat_bottom = this.last_record_end;
		const chat_top = this.last_record_end - objects.chat_records.filter(obj => obj.visible === true).length*this.MESSAGE_HEIGHT;
		
		if (objects.chat_records_cont.y+chat_bottom<450)
			objects.chat_records_cont.y = 450-chat_bottom;
		
		if (objects.chat_records_cont.y+chat_top>0)
			objects.chat_records_cont.y=-chat_top;
		
	},
	
	close : function() {
		
		objects.desktop.interactive=false;
		objects.desktop.visible=false;
		objects.chat_cont.visible = false;
		firebase.database().ref('chat').off();
		if (objects.feedback_cont.visible === true)
			feedback.close();
	},
	
	close_down : async function() {
		
		sound.play('click');
		this.close();
		main_menu.activate();
		
	},
	
	open_keyboard : async function() {
		
		//пишем отзыв и отправляем его	
		sound.play('click');
		let fb = await feedback.show(opp_data.uid,65);		
		if (fb[0] === 'sent') {			
			const msg_index=this.get_oldest_index();
			await firebase.database().ref('chat2/'+msg_index).set({uid:my_data.uid,name:my_data.name,msg:fb[1], tm:firebase.database.ServerValue.TIMESTAMP, msg_id:irnd(0,9999999),rating:my_data.rating,msg_index:msg_index});
		}		
	}

	
}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;

		
		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 1,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 1,'easeOutCubic');

		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}


		this.update();

	},

	close: function() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;


	},

	back_button_down: function() {

		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true ||  objects.lb_cards_cont.ready === false) {
			gres.bad_move.sound.play();
			return;			
		}


		gres.click.sound.play();
		this.close();
		main_menu.activate();

	},

	update: function () {

		firebase.database().ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {

			if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='' && players_data.val().name!==undefined)
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					
					if (i >= len) break;		
					if (players_array[i][0] === undefined) break;	
					
					let fname = players_array[i][0];
					make_text(objects['lb_'+(i+1)+'_name'],fname,180);					
					objects['lb_'+(i+1)+'_rating'].text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 3000});
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					
					if (i >= len) break;	
					if (players_array[i][0] === undefined) break;	
					
					let fname=players_array[i][0];

					make_text(objects.lb_cards[i-3].name,fname,180);

					objects.lb_cards[i-3].rating.text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

cards_menu={

	state_tint :{},
	_opp_data : {},
	uid_pic_url_cache : {},
	
	cards_pos: [
				[0,0],[0,90],[0,180],[0,270],
				[190,0],[190,90],[190,180],[190,270],
				[380,0],[380,90],[380,180],[380,270],
				[570,0],[570,90],[570,180]

				],

	activate: function () {

		objects.cards_cont.visible=true;
		objects.back_button_cont.visible=true;

		objects.lobby_frame.visible = true;

		objects.header4.visible=true;
		//objects.desktop.texture=game_res.resources.cards_bcg.texture;

		//расставляем по соответствующим координатам
		for(let i=0;i<15;i++) {
			objects.mini_cards[i].x=this.cards_pos[i][0];
			objects.mini_cards[i].y=this.cards_pos[i][1];
		}

		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<15;i++)
			objects.mini_cards[i].visible=false;

		//добавляем карточку ии
		this.add_cart_ai();

		//включаем сколько игроков онлайн
		objects.players_online.visible=true;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name) .on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});


		
		//game_watching.activate();


	},

	players_list_updated: function(players) {

		//если мы в игре то не обновляем карточки
		if (state==="p" || state==="b")
			return;


		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};


		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков
		for (let uid in players){			
			if (players[uid].state !== 'p' && players[uid].hidden === 0)
				single[uid] = players[uid].name;						
		}
		
		//console.table(single);
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];
		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
			//проходимся по соперникам
			for (let uid2 in players) {	
				let s_id=uid2.substring(0,10);				
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}							
			}			
		}
				
		
		//определяем столы
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			const opp_id = p_data[uid].opp_id;
			const name1 = p_data[uid].name;
			const rating = p_data[uid].rating;
			const hid = p_data[uid].hidden;
			const game_id=p_data[uid].game_id;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;		
					tables[uid].game_id=game_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 	{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игроков
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
		objects.players_online.text=['Игроков онлайн: ','Players online: '][LANG] + num;
		
		
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > 14) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - 14);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=1;i<15;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state , rating:players[card_uid].rating});
			}
		}

		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=1;i<15;i++) {			
			
				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {					
					if (p ===  objects.mini_cards[i].uid) {
						
						found = 1;							
					}	
				}				
			}		
			
			if (found === 0)
				new_single[p] = single[p];
		}
		

		
		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=1;i<15;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;						
					}							
				}
								
				if (found === 0)
					objects.mini_cards[i].visible = false;
			}	
		}
		
		
		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)			
			this.place_new_cart({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			const n1=players[uid].name
			const n2=players[tables[uid]].name
			
			const r1= players[uid].rating
			const r2= players[tables[uid]].rating
			
			const game_id=players[uid].game_id;
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2, game_id:game_id});
		}
		
	},

	get_state_tint: function(s) {

		switch(s) {

			case "o":
				return this.state_tint.o;
			break;

			case "b":
				return this.state_tint.b;
			break;

			case "p":
				return this.state_tint.p;
			break;

			case "w":
				return this.state_tint.w;
			break;
		}
	},

	place_table : function (params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400, game_id: 0}) {
				
		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				objects.mini_cards[i].bcg.tint=this.state_tint.p;
				
				//присваиваем карточке данные
				//objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].uid1=params.uid1;
				objects.mini_cards[i].uid2=params.uid2;
												
				//убираем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = false;
				objects.mini_cards[i].avatar.visible = false;
				objects.mini_cards[i].name_text.visible = false;

				//Включаем элементы стола 
				objects.mini_cards[i].rating_text1.visible = true;
				objects.mini_cards[i].rating_text2.visible = true;
				objects.mini_cards[i].avatar1.visible = true;
				objects.mini_cards[i].avatar2.visible = true;
				objects.mini_cards[i].rating_bcg.visible = true;

				objects.mini_cards[i].rating_text1.text = params.rating1;
				objects.mini_cards[i].rating_text2.text = params.rating2;
				
				objects.mini_cards[i].name1 = params.name1;
				objects.mini_cards[i].name2 = params.name2;
				
				objects.mini_cards[i].game_id=params.game_id;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:objects.mini_cards[i].avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:objects.mini_cards[i].avatar2});


				objects.mini_cards[i].visible=true;


				break;
			}
		}
		
	},

	update_existing_card: function(params={id:0, state:"o" , rating:1400}) {

		//устанавливаем цвет карточки в зависимости от состояния(имя и аватар не поменялись)
		objects.mini_cards[params.id].bcg.tint=this.get_state_tint(params.state);
		objects.mini_cards[params.id].state=params.state;

		objects.mini_cards[params.id].rating=params.rating;
		objects.mini_cards[params.id].rating_text.text=params.rating;
		objects.mini_cards[params.id].visible=true;
	},

	place_new_cart: function(params={uid:0, state: "o", name: "XXX", rating: rating}) {

		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture = gres.mini_player_card.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "single";

				//присваиваем карточке данные
				objects.mini_cards[i].uid=params.uid;

				//убираем элементы стола так как они не нужны
				objects.mini_cards[i].rating_text1.visible = false;
				objects.mini_cards[i].rating_text2.visible = false;
				objects.mini_cards[i].avatar1.visible = false;
				objects.mini_cards[i].avatar2.visible = false;
				objects.mini_cards[i].rating_bcg.visible = false;
				
				//включаем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = true;
				objects.mini_cards[i].avatar.visible = true;
				objects.mini_cards[i].name_text.visible = true;

				objects.mini_cards[i].name=params.name;
				make_text(objects.mini_cards[i].name_text,params.name,110);
				objects.mini_cards[i].rating=params.rating;
				objects.mini_cards[i].rating_text.text=params.rating;

				objects.mini_cards[i].visible=true;

				//стираем старые данные
				objects.mini_cards[i].avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:objects.mini_cards[i].avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				break;
			}
		}

	},

	get_texture : function (pic_url) {
		
		return new Promise((resolve,reject)=>{
			
			//меняем адрес который невозможно загрузить
			if (pic_url==="https://vk.com/images/camera_100.png")
				pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";

			//сначала смотрим на загруженные аватарки в кэше
			if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

				//загружаем аватарку игрока
				//console.log(`Загружаем url из интернети или кэша браузера ${pic_url}`)	
				let loader=new PIXI.Loader();
				loader.add("pic", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
				loader.load(function(l,r) {	resolve(l.resources.pic.texture)});
			}
			else
			{
				//загружаем текустуру из кэша
				//console.log(`Текстура взята из кэша ${pic_url}`)	
				resolve (PIXI.utils.TextureCache[pic_url]);
			}
		})
		
	},
	
	get_uid_pic_url : function (uid) {
		
		return new Promise((resolve,reject)=>{
						
			//проверяем есть ли у этого id назначенная pic_url
			if (this.uid_pic_url_cache[uid] !== undefined) {
				//console.log(`Взяли pic_url из кэша ${this.uid_pic_url_cache[uid]}`);
				resolve(this.uid_pic_url_cache[uid]);		
				return;
			}

							
			//получаем pic_url из фб
			firebase.database().ref("players/" + uid + "/pic_url").once('value').then((res) => {

				pic_url=res.val();
				
				if (pic_url === null) {
					
					//загрузить не получилось поэтому возвращаем случайную картинку
					resolve('https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid);
				}
				else {
					
					//добавляем полученный pic_url в кэш
					//console.log(`Получили pic_url из ФБ ${pic_url}`)	
					this.uid_pic_url_cache[uid] = pic_url;
					resolve (pic_url);
				}
				
			});		
		})
		
	},
	
	load_avatar2 : function (params = {uid : 0, tar_obj : 0, card_id : 0}) {
		
		//получаем pic_url
		this.get_uid_pic_url(params.uid).then(pic_url => {
			return this.get_texture(pic_url);
		}).then(t=>{			
			params.tar_obj.texture=t;			
		})	
	},

	add_cart_ai: function() {

		//убираем элементы стола так как они не нужны
		objects.mini_cards[0].rating_text1.visible = false;
		objects.mini_cards[0].rating_text2.visible = false;
		objects.mini_cards[0].avatar1.visible = false;
		objects.mini_cards[0].avatar2.visible = false;
		objects.mini_cards[0].rating_bcg.visible = false;

		objects.mini_cards[0].bcg.tint=this.state_tint.bot;
		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="AI";
		objects.mini_cards[0].name=['Бот','Bot'][LANG];
		objects.mini_cards[0].name_text.text=['Бот','Bot'][LANG];
		objects.mini_cards[0].rating_text.text='1400';
		objects.mini_cards[0].rating=1400;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;
	},
	
	card_down : function ( card_id ) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog : function (card_id) {
		
		if (anim2.any_on() || objects.td_cont.ready === false || objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			gres.locked.sound.play();
			return
		};


		gres.click.sound.play();
		
		//console.log(objects.mini_cards[card_id].game_id);
		
		anim2.add(objects.td_cont,{y:[-150,objects.td_cont.sy]}, true, 0.5,'easeOutBack');
		
		objects.td_cont.card=objects.mini_cards[card_id];
		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].rating_text1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].rating_text2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 150);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 150);

	},
	
	close_table_dialog : function () {
		
		if (objects.td_cont.ready === false)
			return;
		
		
		gres.close_it.sound.play();
		
		anim2.add(objects.td_cont,{y:[objects.td_cont.sy,400,]}, false, 0.5,'easeInBack');
		
	},

	show_invite_dialog: function(cart_id) {


		if (objects.invite_cont.ready === false || objects.invite_cont.visible === true || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			game_res.resources.locked.sound.play();
			return
		};


		pending_player="";

		gres.click.sound.play();

		//показыаем кнопку приглашения
		

	
		anim2.add(objects.invite_cont,{y:[450, objects.invite_cont.sy]}, true, 0.6,'easeOutBack');

		//копируем предварительные данные
		cards_menu._opp_data = {uid:objects.mini_cards[cart_id].uid,name:objects.mini_cards[cart_id].name,rating:objects.mini_cards[cart_id].rating};


		let invite_available = 	cards_menu._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="o" || objects.mini_cards[cart_id].state==="b");
		invite_available=invite_available || cards_menu._opp_data.uid==="AI";
		objects.invite_button.state='';
		
		//показыаем кнопку приглашения только если это допустимо
		if (invite_available === true) {
			objects.invite_button.visible = true;		
			
			objects.invite_button.texture = gres.invite_button.texture;	
		} else {
			objects.invite_button.visible = false;
		}


		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		make_text(objects.invite_name,cards_menu._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;

	},

	peek_down(){
		
		//активируем просмотр игры
		game_watching.activate(objects.td_cont.card);
		
		this.close();
		
	},

	close: function() {

		objects.cards_cont.visible=false;
		objects.back_button_cont.visible=false;
		//objects.desktop.visible=false;

		objects.lobby_frame.visible=false;
		objects.header4.visible=false;

		if (objects.invite_cont.visible === true)
			this.hide_invite_dialog();
		
		if (objects.td_cont.visible === true)
			this.close_table_dialog();

		//больше ни ждем ответ ни от кого
		pending_player="";

		//убираем сколько игроков онлайн
		objects.players_online.visible=false;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).off();

	},

	hide_invite_dialog: function() {

		if (objects.invite_cont.ready === false)
			return;
		
		gres.close_it.sound.play();

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="") {
			firebase.database().ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player="";
		}

		anim2.add(objects.invite_cont,{y:[objects.invite_cont.sy,400]}, false, 0.5,'easeInBack');
	},

	send_invite: function() {


		if (objects.invite_button.state==='invited'||objects.invite_cont.ready === false || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			gres.locked.sound.play();
			return
		}

		if (cards_menu._opp_data.uid==="AI")
		{
			cards_menu._opp_data.rating = 1400;
			
			make_text(objects.opp_card_name,cards_menu._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;				
			
			this.close();
			game.activate('master', bot_player );
		}
		else
		{
			gres.click.sound.play();
			objects.invite_button.texture = gres.invite_button_waiting.texture;
			objects.invite_button.state='invited';
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;
		}



	},

	rejected_invite: function() {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show(['Соперник отказался от игры','Opponent refused to play'][LANG],'(((');

	},

	accepted_invite: function() {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=cards_menu._opp_data;
		
		//сразу карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=objects.invite_avatar.texture;		

		cards_menu.close();
		game.activate("master" , online_game );
	},

	back_button_down: function() {

		if (objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true ||objects.invite_cont.visible === true)	{
			gres.locked.sound.play();
			return
		};



		gres.close_it.sound.play();

		this.close();
		main_menu.activate();

	}

}

auth2={
		
	load_script(src) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.onload = resolve
		script.onerror = reject
		script.src = src
		document.head.appendChild(script)
	  })
	},
			
	get_random_char () {		
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		return chars[irnd(0,chars.length-1)];
		
	},
	
	get_random_uid_for_local (prefix) {
		
		let uid = prefix;
		for ( let c = 0 ; c < 12 ; c++ )
			uid += this.get_random_char();
		
		//сохраняем этот uid в локальном хранилище
		try {
			localStorage.setItem('poker_uid', uid);
		} catch (e) {alert(e)}
					
		return uid;
		
	},
	
	get_random_name(uid) {
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const rnd_names = ['Gamma','Chime','Dron','Perl','Onyx','Asti','Wolf','Roll','Lime','Cosy','Hot','Kent','Pony','Baker','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
		
		if (uid !== undefined) {
			
			let e_num1 = chars.indexOf(uid[3]) + chars.indexOf(uid[4]) + chars.indexOf(uid[5]) + chars.indexOf(uid[6]);
			e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);				
			let name_postfix = chars.indexOf(uid[7]).toString() + chars.indexOf(uid[8]).toString() + chars.indexOf(uid[9]).toString() ;	
			return rnd_names[e_num1] + name_postfix.substring(0, 3);					
			
		} else {

			let rnd_num = irnd(0, rnd_names.length - 1);
			let rand_uid = irnd(0, 999999)+ 100;
			let name_postfix = rand_uid.toString().substring(0, 3);
			let name =	rnd_names[rnd_num] + name_postfix;				
			return name;
		}	
	},	
	
	async get_country_code() {
		
		let country_code = ''
		try {
			let resp1 = await fetch("https://ipinfo.io/json");
			let resp2 = await resp1.json();			
			country_code = resp2.country;			
		} catch(e){}

		return country_code||'';
		
	},
	
	search_in_local_storage() {
		
		//ищем в локальном хранилище
		let local_uid = null;
		
		try {
			local_uid = localStorage.getItem('poker_uid');
		} catch (e) {alert(e)}
				
		if (local_uid !== null) return local_uid;
		
		return undefined;	
		
	},
	
	async search_in_crazygames(){
		if(!window.CrazyGames.SDK)
			return {};
		
		let token='';
		try{
			token = await window.CrazyGames.SDK.user.getUserToken();
		}catch(e){
			return {};
		}
		const user = window.jwt_decode(token);
		return user || {};
	},
		
	init : async function() {	
				
		if (game_platform === 'YANDEX') {			
		
			try {await this.load_script('https://yandex.ru/games/sdk/v2')} catch (e) {alert(e)};										
					
			let _player;
			
			try {
				window.ysdk = await YaGames.init({});			
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};
			
			my_data.uid = _player.getUniqueID().replace(/[\/+=]/g, '');
			my_data.name = _player.getName();
			my_data.pic_url = _player.getPhoto('medium');
			
			if (my_data.pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
				my_data.pic_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid;	
			
			if (my_data.name === '')
				my_data.name = this.get_random_name(my_data.uid);
			
			//если английский яндекс до добавляем к имени страну
			let country_code = await this.get_country_code();
			my_data.name = my_data.name + ' (' + country_code + ')';			


			
			return;
		}
		
		if (game_platform === 'VK') {
			
			try {await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')} catch (e) {alert(e)};
			
			let _player;
			
			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');				
			} catch (e) {alert(e)};

			
			my_data.name 	= _player.first_name + ' ' + _player.last_name;
			my_data.uid 	= "vk"+_player.id;
			my_data.pic_url = _player.photo_100;
			
			return;
			
		}
		
		if (game_platform === 'GOOGLE_PLAY') {	

			let country_code = await this.get_country_code();
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('GP_');
			my_data.name = this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid;		
			return;
		}
		
		if (game_platform === 'DEBUG') {		

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.pic_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid;			
			return;
		}
		
		if (game_platform === 'CRAZYGAMES') {			
			
			try {await this.load_script('https://sdk.crazygames.com/crazygames-sdk-v2.js')} catch (e) {alert(e)};	
			try {await this.load_script('https://akukamil.github.io/quoridor/jwt-decode.js')} catch (e) {alert(e)};		
			let country_code = await this.get_country_code();
			const cg_user_data=await this.search_in_crazygames();			
		
			my_data.uid = cg_user_data.userId || this.search_in_local_storage() || this.get_random_uid_for_local('CG_');
			my_data.name = cg_user_data.username || this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = cg_user_data.profilePictureUrl || ('https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid);	
					

			//перезапускаем если авторизация прошла
			
			window.CrazyGames.SDK.user.addAuthListener(function(user){	
				if (user?.id&&user.id!==my_data.uid){
					console.log('user changed',user);
					location.reload();	
				}	
			});

					
			return;
		}
		
		if (game_platform === 'UNKNOWN') {
			
			//если не нашли платформу
			//alert('Неизвестная платформа. Кто Вы?')
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('LS_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.pic_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid;		
		}
	},
	    	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {

	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		h_state=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	firebase.database().ref(room_name+'/'+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id, game_id:game_id});

}

function vis_change() {

	if (document.hidden === true)
		hidden_state_start = Date.now();
	
	set_state({hidden : document.hidden});
	
		
}

async function load_user_data() {
	
	try {
	
	
		//анимация лупы
		some_process.loup_anim=function() {
			objects.id_loup.x=20*Math.sin(game_tick*8)+90;
			objects.id_loup.y=20*Math.cos(game_tick*8)+110;
		}
	
		//получаем данные об игроке из социальных сетей
		await auth2.init();
			
		//устанавлием имя на карточки
		make_text(objects.id_name,my_data.name,150);
		make_text(objects.my_card_name,my_data.name,150);
			
		//ждем пока загрузится аватар
		let loader=new PIXI.Loader();
		loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
		await new Promise((resolve, reject)=> loader.load(resolve))
		
		my_data.my_texture=loader.resources.my_avatar.texture;
		objects.id_avatar.texture=objects.my_avatar.texture=loader.resources.my_avatar.texture;
		
		//получаем остальные данные об игроке
		let snapshot = await firebase.database().ref("players/"+my_data.uid).once('value');
		let other_data = snapshot.val();
		
		
		//делаем защиту от неопределенности
		my_data.rating = (other_data && other_data.rating) || 1400;	
		my_data.games = (other_data && other_data.games) || 0;
		my_data.chip = (other_data && other_data.chip) || 0;	
			
		//отключение от игры и удаление не нужного
		firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
		firebase.database().ref(room_name+'/'+my_data.uid).onDisconnect().remove();			

		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

		//обновляем почтовый ящик
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		//подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

		//обновляем данные в файербейс так как могли поменяться имя или фото
		firebase.database().ref("players/"+my_data.uid).set({name:my_data.name, pic_url: my_data.pic_url, rating : my_data.rating, chip : my_data.chip, games : my_data.games, tm:firebase.database.ServerValue.TIMESTAMP});

		//устанавливаем мой статус в онлайн
		set_state({state : 'o'});



		//это событие когда меняется видимость приложения
		document.addEventListener("visibilitychange", vis_change);

		//keep-alive сервис
		setInterval(function()	{keep_alive()}, 40000);

	
		//ждем и убираем попап
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		

		anim2.add(objects.id_cont,{y:[objects.id_cont.y, -200]}, false, 1,'easeInBack');
		
		some_process.loup_anim=function() {};
		
	
	} catch (error) {		
		alert (error);		
	}
	
}

async function init_game_env(lng) {
			
	
	await define_platform_and_language();
	console.log(game_platform, LANG);
		
		
	//отображаем шкалу загрузки
	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;	}body {display: flex;align-items: center;justify-content: center;background-color: rgba(41,41,41,1);flex-direction: column	}#m_progress {	  background: #1a1a1a;	  justify-content: flex-start;	  border-radius: 5px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;	  border-radius: 5px;	  background: rgb(119, 119, 119);	  height: 70%;	  width: 0%;	}	</style></div><div id="m_progress">  <div id="m_bar"></div></div>';
		
		
	//ждем когда загрузятся ресурсы
	await load_resources();

	//убираем загрузочные данные
	//document.getElementById("m_bar").outerHTML = "";
	//document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyDwyhzpCq06nXWtzTfPZ86I0jI_iUedJDg",
			authDomain: "quoridor-e5c40.firebaseapp.com",
			databaseURL: "https://quoridor-e5c40-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "quoridor-e5c40",
			storageBucket: "quoridor-e5c40.appspot.com",
			messagingSenderId: "114845860106",
			appId: "1:114845860106:web:fa020d476b1f1c28853af3"
		});
	}
	
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false});
	document.body.appendChild(app.view);

	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }
	
	
	//загружаем данные об игроке
	load_user_data();
	
	room_name='states';
	
	//нажатие клавиш на клавиатуре
	window.addEventListener('keydown', function(event) {feedback.key_down(event.key)});
	window.addEventListener("wheel", (event) => {event.preventDefault();chat.wheel_event(Math.sign(event.deltaY))}, {passive: false});	
	
	//показыаем основное меню
	main_menu.activate();
	console.clear()
	
	//контроль за присутсвием
	var connected_control = firebase.database().ref(".info/connected");
	connected_control.on("value", (snap) => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});

	//запускаем главный цикл
	main_loop();

}

language_dialog = {
	
	p_resolve : {},
	
	show : function() {
				
		return new Promise(function(resolve, reject){


			document.body.innerHTML='<style>		html,		body {		margin: 0;		padding: 0;		height: 100%;	}		body {		display: flex;		align-items: center;		justify-content: center;		background-color: rgba(24,24,64,1);		flex-direction: column	}		.two_buttons_area {	  width: 70%;	  height: 50%;	  margin: 20px 20px 0px 20px;	  display: flex;	  flex-direction: row;	}		.button {		margin: 5px 5px 5px 5px;		width: 50%;		height: 100%;		color:white;		display: block;		background-color: rgba(44,55,100,1);		font-size: 10vw;		padding: 0px;	}  	#m_progress {	  background: rgba(11,255,255,0.1);	  justify-content: flex-start;	  border-radius: 100px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 10px 40px -10px #fff;	  border-radius: 100px;	  background: #fff;	  height: 70%;	  width: 0%;	}	</style><div id ="two_buttons" class="two_buttons_area">	<button class="button" id ="but_ref1" onclick="language_dialog.p_resolve(0)">RUS</button>	<button class="button" id ="but_ref2"  onclick="language_dialog.p_resolve(1)">ENG</button></div><div id="m_progress">  <div id="m_bar"></div></div>';
			
			language_dialog.p_resolve = resolve;	
						
		})
		
	}
	
}

async function define_platform_and_language() {
	
	let s = window.location.href;
	
	if (s.includes('yandex')) {
		
		game_platform = 'YANDEX';
		
		if (s.match(/yandex\.ru|yandex\.by|yandex\.kg|yandex\.kz|yandex\.tj|yandex\.ua|yandex\.uz/))
			LANG = 0;
		else 
			LANG = 1;		
		return;
	}
	
	if (s.includes('vk.com')) {
		game_platform = 'VK';	
		LANG = 0;	
		return;
	}
	
	if (s.includes('google_play')) {
			
		game_platform = 'GOOGLE_PLAY';	
		LANG = await language_dialog.show();
		return;
	}	
	
	if (s.includes('crazygames')) {
			
		game_platform = 'CRAZYGAMES';	
		LANG = 1;
		return;
	}
	
	if (s.includes('192.168')) {
			
		game_platform = 'DEBUG';	
		LANG = await language_dialog.show();
		return;	
	}	
	
	game_platform = 'UNKNOWN';	
	LANG = await language_dialog.show();
	
	

}

async function load_resources() {

	document.getElementById("m_progress").style.display = 'flex';

	//подпапка с ресурсами
	let lang_pack = ['RUS','ENG'][LANG];

	let git_src='https://akukamil.github.io/quoridor/'
	//git_src=''


	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"/fonts/Neucha/font.fnt");

	game_res.add('click',git_src+'/sounds/click.mp3');
	game_res.add('locked',git_src+'/sounds/locked.mp3');
	game_res.add('locked2',git_src+'/sounds/locked2.mp3');
	game_res.add('clock',git_src+'/sounds/clock.mp3');
	game_res.add('close_it',git_src+'/sounds/close_it.mp3');
	game_res.add('game_start',git_src+'/sounds/game_start.mp3');
	game_res.add('lose',git_src+'/sounds/lose.mp3');
	game_res.add('receive_move',git_src+'/sounds/receive_move.mp3');
	game_res.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
	game_res.add('block_wall',git_src+'/sounds/block_wall.mp3');
	game_res.add('good_word',git_src+'/sounds/good_word.mp3');
	game_res.add('key_down',git_src+'/sounds/key_down.mp3');
	game_res.add('cell_down',git_src+'/sounds/cell_down.mp3');
	game_res.add('iter_wall',git_src+'/sounds/iter_wall.mp3');
	game_res.add('bad_move',git_src+'/sounds/bad_move.mp3');
	game_res.add('win',git_src+'/sounds/win.mp3');
	game_res.add('invite',git_src+'/sounds/invite.mp3');
	game_res.add('draw',git_src+'/sounds/draw.mp3');
	game_res.add('cancel_wall',git_src+'/sounds/cancel_wall.mp3');
	game_res.add('place_wall',git_src+'/sounds/place_wall.mp3');
	game_res.add('checker_tap',git_src+'/sounds/checker_tap.mp3');
	game_res.add('keypress',git_src+'sounds/keypress.mp3');
	
	
	//отдельно загружаем тайлинговый спрайта
	game_res.add('tile_img',git_src+'/res/tile_img.png');

	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"/stickers/"+i+".png");
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+'res/'+lang_pack+'/'+load_list[i].name+"."+load_list[i].image_format);		


	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	
	
	await new Promise((resolve, reject)=> game_res.load(resolve))
	
	//убираем элементы загрузки
	document.getElementById("m_progress").outerHTML = "";	

}

function main_loop() {


	game_tick+=0.016666666;
	anim2.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();


	requestAnimationFrame(main_loop);
}