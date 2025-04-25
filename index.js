const M_WIDTH=800, M_HEIGHT=450;
var app ={stage:{},renderer:{}}, assets={}, game,serv_tm, gdata={}, objects={}, state='',my_role='',LANG = 0, game_tick=0, my_turn=0,room_name='states', game_id=0, h_state=0, made_moves=0,client_id, game_platform="", hidden_state_start = 0, connected = 1, players="", pending_player="",git_src,my_data={opp_id : ''},opp_data={},some_process = {},game_name='quoridor';
const V_WALL = 2, H_WALL = 1, ROW0 = 0, ROW8 = 8, MY_ID = 1, OPP_ID = 2, MAX_MOVES = 50, FIELD_MARGIN_X = 50,FIELD_MARGIN_Y = 30;
const WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;

fbs_once=async function(path){	
	const info=await fbs.ref(path).get();
	return info.val();	
}

irnd = function (min,max) {	
	//мин и макс включительно3
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
		this.type = 'single';
		this.x=x;
		this.y=y;
		
		
		this.bcg=new PIXI.Sprite(assets.mini_player_card);
		this.bcg.width=200;
		this.bcg.height=90;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){lobby.card_down(id)};
		
		this.table_rating_hl=new PIXI.Sprite(assets.table_rating_hl);
		this.table_rating_hl.width=200;
		this.table_rating_hl.height=90;
		
		this.avatar=new PIXI.Graphics();
		this.avatar.x=16;
		this.avatar.y=16;
		this.avatar.w=this.avatar.h=58.2;
		
		this.avatar_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.x=16-11.64;
		this.avatar_frame.y=16-11.64;
		this.avatar_frame.width=this.avatar_frame.height=81.48;
				
		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 22,align: 'center'});
		this.name_text.anchor.set(1,0);
		this.name_text.x=180;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;		

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 30,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(1,0.5);
		this.rating_text.x=180;
		this.rating_text.y=64;		
		this.rating_text.tint=0xffff00;

		//аватар первого игрока
		this.avatar1=new PIXI.Graphics();
		this.avatar1.x=19;
		this.avatar1.y=16;
		this.avatar1.w=this.avatar1.h=58.2;
		
		this.avatar1_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar1_frame.x=this.avatar1.x-11.64;
		this.avatar1_frame.y=this.avatar1.y-11.64;
		this.avatar1_frame.width=this.avatar1_frame.height=81.48;

		//аватар второго игрока
		this.avatar2=new PIXI.Graphics();
		this.avatar2.x=121;
		this.avatar2.y=16;
		this.avatar2.w=this.avatar2.h=58.2;
		
		this.avatar2_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar2_frame.x=this.avatar2.x-11.64;
		this.avatar2_frame.y=this.avatar2.y-11.64;
		this.avatar2_frame.width=this.avatar2_frame.height=81.48;
		
		
		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=48.1;
		this.rating_text1.y=56;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150.1;
		this.rating_text2.y=56;		
		
		this.t_country=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.t_country.tint=0xffff00;
		this.t_country.anchor.set(1,0.5);
		this.t_country.x=105;
		this.t_country.y=65;		
		this.t_country.tint=0xaaaa99;
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar,this.avatar_frame,this.avatar1, this.avatar1_frame, this.avatar2,this.avatar2_frame,this.rating_text,this.table_rating_hl,this.rating_text1,this.rating_text2, this.name_text,this.t_country);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(assets.lb_player_card_bcg);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.place.tint=0xffffff;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=14;
		this.avatar.width=this.avatar.height=44;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.name.tint=0xcceeff;
		this.name.x=105;
		this.name.y=22;

		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating.x=298;
		this.rating.tint=0xFFFF00;
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class chat_record_class extends PIXI.Container {
	
	constructor() {
		
		super();
		
		this.tm=0;
		this.index=0;
		this.uid='';		
		

		
		this.avatar = new PIXI.Graphics();
		this.avatar.w=50;
		this.avatar.h=50;
		this.avatar.x=30;
		this.avatar.y=13;		
				
		this.avatar_bcg = new PIXI.Sprite(assets.chat_avatar_bcg_img);
		this.avatar_bcg.width=70;
		this.avatar_bcg.height=70;
		this.avatar_bcg.x=this.avatar.x-10;
		this.avatar_bcg.y=this.avatar.y-10;
		this.avatar_bcg.interactive=true;
		this.avatar_bcg.pointerdown=()=>chat.avatar_down(this);		
					
		this.avatar_frame = new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.width=70;
		this.avatar_frame.height=70;
		this.avatar_frame.x=this.avatar.x-10;
		this.avatar_frame.y=this.avatar.y-10;
		
		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 17});
		this.name.anchor.set(0,0.5);
		this.name.x=this.avatar.x+72;
		this.name.y=this.avatar.y-1;	
		this.name.tint=0xFBE5D6;
		
		this.gif=new PIXI.Sprite();
		this.gif.x=this.avatar.x+65;	
		this.gif.y=22;
		
		this.gif_bcg=new PIXI.Graphics();
		this.gif_bcg.beginFill(0x111111)
		this.gif_bcg.drawRect(0,0,1,1);
		this.gif_bcg.x=this.gif.x+3;	
		this.gif_bcg.y=this.gif.y+3;
		this.gif_bcg.alpha=0.5;
		
		
				
		this.msg_bcg = new PIXI.NineSlicePlane(assets.msg_bcg,50,18,50,28);
		//this.msg_bcg.width=160;
		//this.msg_bcg.height=65;	
		this.msg_bcg.scale_xy=0.66666;		
		this.msg_bcg.x=this.avatar.x+45;	
		this.msg_bcg.y=this.avatar.y+2;
		
		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 19,lineSpacing:55,align: 'left'}); 
		this.msg.x=this.avatar.x+75;
		this.msg.y=this.avatar.y+30;
		this.msg.maxWidth=450;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0xffffff;
		
		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'mfont',fontSize: 15}); 		
		this.msg_tm.tint=0x999999;
		this.msg_tm.anchor.set(1,0);
		
		this.visible = false;
		this.addChild(this.msg_bcg,this.gif_bcg,this.gif,this.avatar_bcg,this.avatar,this.avatar_frame,this.name,this.msg,this.msg_tm);
		
	}
		
	nameToColor(name) {
		  // Create a hash from the name
		  let hash = 0;
		  for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
			hash = hash & hash; // Convert to 32bit integer
		  }

		  // Generate a color from the hash
		  let color = ((hash >> 24) & 0xFF).toString(16) +
					  ((hash >> 16) & 0xFF).toString(16) +
					  ((hash >> 8) & 0xFF).toString(16) +
					  (hash & 0xFF).toString(16);

		  // Ensure the color is 6 characters long
		  color = ('000000' + color).slice(-6);

		  // Convert the hex color to an RGB value
		  let r = parseInt(color.slice(0, 2), 16);
		  let g = parseInt(color.slice(2, 4), 16);
		  let b = parseInt(color.slice(4, 6), 16);

		  // Ensure the color is bright enough for a black background
		  // by normalizing the brightness.
		  if ((r * 0.299 + g * 0.587 + b * 0.114) < 128) {
			r = Math.min(r + 128, 255);
			g = Math.min(g + 128, 255);
			b = Math.min(b + 128, 255);
		  }

		  return (r << 16) + (g << 8) + b;
	}
		
	async update_avatar(uid, tar_sprite) {		
	
		//определяем pic_url
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		tar_sprite.set_texture(players_cache.players[uid].texture);	
	}
	
	async set(msg_data) {
						
		//получаем pic_url из фб
		this.avatar.set_texture(PIXI.Texture.WHITE);
				
		await this.update_avatar(msg_data.uid, this.avatar);

		this.uid=msg_data.uid;
		this.tm = msg_data.tm;			
		this.index = msg_data.index;		
		
		this.name.set2(msg_data.name,150);
		this.name.tint=this.nameToColor(msg_data.name);
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		this.msg.text=msg_data.msg;
		this.visible = true;
		
		if (msg_data.msg.startsWith('GIF')){			
			
			const mp4BaseT=await new Promise((resolve, reject)=>{
				const baseTexture = PIXI.BaseTexture.from('https://akukamil.github.io/common/gifs/'+msg_data.msg+'.mp4');
				if (baseTexture.width>1) resolve(baseTexture);
				baseTexture.on('loaded', () => resolve(baseTexture));
				baseTexture.on('error', (error) => resolve(null));
			});
			
			if (!mp4BaseT) {
				this.visible=false;
				return 0;
			}
			
			mp4BaseT.resource.source.play();
			mp4BaseT.resource.source.loop=true;
			
			this.gif.texture=PIXI.Texture.from(mp4BaseT);
			this.gif.visible=true;	
			const aspect_ratio=mp4BaseT.width/mp4BaseT.height;
			this.gif.height=90;
			this.gif.width=this.gif.height*aspect_ratio;
			this.msg_bcg.visible=false;
			this.msg.visible=false;
			this.msg_tm.anchor.set(0,0);
			this.msg_tm.y=this.gif.height+9;
			this.msg_tm.x=this.gif.width+102;
			
			this.gif_bcg.visible=true;
			this.gif_bcg.height=this.gif.height;
			this.gif_bcg.width=	this.gif.width;
			return this.gif.height+30;
			
		}else{
			
			this.gif_bcg.visible=false;
			this.gif.visible=false;	
			this.msg_bcg.visible=true;
			this.msg.visible=true;
			
			//бэкграунд сообщения в зависимости от длины
			const msg_bcg_width=Math.max(this.msg.width,100)+100;			
			this.msg_bcg.width=msg_bcg_width*1.5;				
					
			if (msg_bcg_width>300){
				this.msg_tm.anchor.set(1,0);
				this.msg_tm.y=this.avatar.y+52;
				this.msg_tm.x=msg_bcg_width+55;
			}else{
				this.msg_tm.anchor.set(0,0);
				this.msg_tm.y=this.avatar.y+37;
				this.msg_tm.x=msg_bcg_width+62;
			}	
			
			return 70;
		}		
	}		

}

class feedback_record_class extends PIXI.Container {
	
	constructor() {
		
		super();		
		this.text=new PIXI.BitmapText('Николай: хорошая игра', {fontName: 'mfont',fontSize: 23,align: 'left',lineSpacing:40}); 
		this.text.maxWidth=290;
		this.text.tint=0xFFFF00;
		
		this.name_text=new PIXI.BitmapText('Николай:', {fontName: 'mfont',fontSize: 23,align: 'left'}); 
		this.name_text.tint=0xFFFFFF;
		
		
		this.addChild(this.text,this.name_text)
	}		
	
	set(name, feedback_text){
		this.text.text=name+': '+feedback_text;
		this.name_text.text=name+':';
	
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

sound={	
	
	on : 1,
	
	play(snd_res) {
		
		if (!this.on||document.hidden)
			return;
				
		if (!assets[snd_res])
			return;
		
		assets[snd_res].play();		
		
	},
	
	switch(){
		
		if (this.on){
			this.on=0;
			objects.pref_info.text=['Звуки отключены','Sounds is off'][LANG];
			
		} else{
			this.on=1;
			objects.pref_info.text=['Звуки включены','Sounds is on'][LANG];
		}
		anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);		
		
	}
	
}

message =  {
	
	promise_resolve :0,
	
	add : async function(text) {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");
		
		//воспроизводим звук
		sound.play('block_wall');

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
	empty_spr : {x:0, visible:false, ready:true, alpha:0},
		
	slot: Array(30).fill(null),
		
	
	any_on() {		
		for (let s of this.slot)
			if (s !== null&&s.block)
				return true
		return false;			
	},
	
	linear(x) {
		return x
	},
	
	kill_anim(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj){
					this.slot[i].p_resolve('finished');		
					this.slot[i].obj.ready=true;					
					this.slot[i]=null;	
				}
	
	},
	
	flick(x){
		
		return Math.abs(Math.sin(x*6.5*3.141593));
		
	},
	
	easeBridge(x){
		
		if(x<0.1)
			return x*10;
		if(x>0.9)
			return (1-x)*10;
		return 1		
	},
	
	ease3peaks(x){

		if (x < 0.16666) {
			return x / 0.16666;
		} else if (x < 0.33326) {
			return 1-(x - 0.16666) / 0.16666;
		} else if (x < 0.49986) {
			return (x - 0.3326) / 0.16666;
		} else if (x < 0.66646) {
			return 1-(x - 0.49986) / 0.16666;
		} else if (x < 0.83306) {
			return (x - 0.6649) / 0.16666;
		} else if (x >= 0.83306) {
			return 1-(x - 0.83306) / 0.16666;
		}		
	},
	
	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutBack2(x) {
		return -5.875*Math.pow(x, 2)+6.875*x;
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
	
	easeInCubic(x) {
		return x * x * x;
	},
	
	ease2back(x) {
		return Math.sin(x*Math.PI);
	},
	
	easeInOutCubic(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake(x) {
		
		return Math.sin(x*2 * Math.PI);	
		
	},	
	
	add (obj, params, vis_on_end, time, func, block=true) {
				
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
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back' || func === 'shake' || func === 'ease3peaks')
					for (let key in params)
						params[key][1]=params[key][0];				
					
				this.slot[i] = {
					obj,
					block,
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
			if (this.slot[i] !== null) {
				
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
		
	},
	
	async wait(time) {
		
		await this.add(this.empty_spr,{x:[0, 1]}, false, time,'linear');	
		
	}
}

big_message = {
	
	p_resolve : 0,
		
	show(t1,t2, feedback_on) {
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';
		
		objects.feedback_button.visible = feedback_on;

		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{y:[-180,objects.big_message_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	async feedback_down() {
		
		if (objects.big_message_cont.ready===false) {
			sound.play('locked');
			return;			
		}


		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');	
		
		//пишем отзыв и отправляем его		
		const fb = await keyboard.read();		
		if (fb.length>0) {
			const fb_id = irnd(0,50);			
			await firebase.database().ref('fb/'+opp_data.uid+'/'+fb_id).set([fb, firebase.database.ServerValue.TIMESTAMP, my_data.name]);
		
		}		
		this.p_resolve('close');
				
	},

	close () {
		
		if (objects.big_message_cont.ready===false)
			return;

		sound.play('close_it');
		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

online_game = {
		
	timer_id : 0,
	start_time : 0,
	me_conf_play : 0,
	opp_conf_play : 0,
	time_for_move:0,
	prv_tick_time:0,
	disconnect_time : 0,
	no_incoming_move : 0,
	write_fb_timer:0,
	
	calc_new_rating(old_rating, game_result) {
				
		if (game_result === NOSYNC)	return old_rating;
				
		const Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		const Sa = (game_result + 1) / 2;
		return Math.round(my_data.rating + 16 * (Sa - Ea));
		
	},
	
	async activate(r) {
		
		this.me_conf_play = 0;
		this.opp_conf_play = 0;
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'p'});

		//получаем информацию о фишке соперника
		const opp_chip = await fbs_once('players/'+opp_data.uid+'/chip')||0
		objects.opp_icon.texture = assets['chip'+opp_chip]
		
		//это если фишки совпадают
		if (opp_chip===my_data.chip)
			objects.opp_icon.tint=0xff8800;
		else
			objects.opp_icon.tint=0xffffff;
		
		//показываем кнопки
		objects.game_buttons_cont.visible = true;

		//счетчик времени
		this.prv_tick_time=Date.now();
		this.reset_timer(15);
		
		//отображаем таймер
		objects.timer_cont.visible = true;
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		let lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		if (lose_rating >100 && lose_rating<9999)
			firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);
	
	},
		
	send_move (data) {
		
		//отправляем ход сопернику
		clearTimeout(online_game.write_fb_timer);
		online_game.write_fb_timer=setTimeout(function(){online_game.stop('my_no_connection');}, 8000); 
		firebase.database().ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'MOVE',tm:Date.now(),data:data}).then(()=>{	
			clearTimeout(online_game.write_fb_timer);
		});	
		
		//также фиксируем данные стола
		firebase.database().ref('tables/'+game_id).set({uid:my_data.uid,f_str:ffunc.get_minified_field(game.field),tm:firebase.database.ServerValue.TIMESTAMP});

	},
	
	reset_timer(t) {
				
		//обовляем время разъединения
		this.timer_start_time=Date.now();
		this.timer_prv_time=Date.now();
		this.disconnect_time=0;		
		
		clearInterval(this.timer_id);
		this.timer_id=setInterval(()=>{online_game.timer_tick()},1000);
						
		this.me_conf_play&&this.opp_conf_play
			? this.time_for_move=40
			: this.time_for_move=15
			
		objects.timer_cont.x = [650,10][my_turn];			
		objects.timer_text.text = '0:'+this.time_for_move;
		objects.timer_bcg.tint=0xbbbbff;	

	},
	
	timer_tick () {		
		
		const cur_time=Date.now();
		if ((cur_time-this.prv_tick_time)>5000||cur_time<this.prv_tick_time){
			game.stop('timer_error');			
			return;
		}			
		this.prv_tick_time=Date.now();
		
		const time_passed=Math.floor((Date.now()-this.timer_start_time)*0.001);
		const move_time_left=this.time_for_move-time_passed;	
				
		if (move_time_left < 0 && my_turn)	{
			
			if (this.me_conf_play === 1)
				game.stop('my_timeout');
			else
				game.stop('my_no_sync');	
			
			return;
		}

		if (move_time_left < -5 && !my_turn)	{
			
			if (this.opp_conf_play === 1)
				game.stop('opp_timeout');
			else
				game.stop('opp_no_sync');
			
			return;
		}
		
		if (!connected ) {
			this.disconnect_time ++;
			if (this.disconnect_time > 5) {
				game.stop('my_no_connection');
				return;				
			}
		}

		//подсвечиваем красным если осталость мало времени
		if (move_time_left === 8) {
			objects.timer_bcg.tint=0xff3333;	
			sound.play('clock');
		}
		
		//обновляем текст на экране
		if (move_time_left>=0)
			objects.timer_text.text = (move_time_left>9?'0:':'0:0')+move_time_left;
		

	},
	
	async stop(result) {
					
		const res_array = [
			['my_timeout',LOSE, ['Вы проиграли!\nУ вас закончилось время','You have lost!\nYou have run out of time']],
			['opp_timeout',WIN , ['Вы выиграли!\nУ соперника закончилось время','You won!\nThe opponent has run out of time']],
			['my_giveup' ,LOSE, ['Вы сдались!','You have given up!']],
			['opp_giveup' ,WIN , ['Вы выиграли!\nСоперник сдался','You won!\nOpponent gave up']],
			['both_finished',DRAW, ['Ничья','Draw']],
			['my_no_connection',LOSE,['Потеряна связь! Используйте надежное интернет соединение.','Lost connection! Use a reliable internet connection']],
			['my_finished_first',WIN , ['Вы выиграли!\nБыстрее соперника добрались до цели','You won!\nFaster than the opponent got to the goal']],
			['opp_finished_first',LOSE, ['Вы проиграли!\nСоперник оказался быстрее вас.','You have lost!\nOpponent was faster than you']],
			['my_closer_after_80',WIN , ['Вы выиграли!\nВы оказались ближе к цели.','You won!\nYou were closer to the goal']],
			['opp_closer_after_80',LOSE, ['Вы проиграли!\nСоперник оказался ближе к цели.','You have lost!\nOpponent was closer to the goal']],
			['both_closer_80',DRAW , ['Ничья\nОба на одинаковом расстоянии до цели','Draw\nBoth at the same distance to the goal']],
			['timer_error' ,LOSE, ['Ошибка таймера!','Timer error!']],
			['my_no_sync',NOSYNC , ['Похоже вы не захотели начинать игру.','It looks like you did not want to start the game']],
			['opp_no_sync',NOSYNC , ['Похоже соперник не смог начать игру.','It looks like the opponent could not start the game']],
			['my_no_connection',LOSE , ['Потеряна связь!\nИспользуйте надежное интернет соединение.','Lost connection!\nUse a reliable internet connection']]
		];		
					
		clearInterval(this.timer_id);		
		
		const result_row = res_array.find( p => p[0] === result);
		const result_str = result_row[0];
		const result_number = result_row[1];
		const result_info = result_row[2][LANG];				
		const old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, result_number);
		objects.my_card_rating.text = my_data.rating;
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
	
		//также фиксируем данные стола
		firebase.database().ref("tables/"+game_id).set({uid:my_data.uid,fin_flag:1,tm:firebase.database.ServerValue.TIMESTAMP});
		
		//убираем элементы
		objects.timer_cont.visible = false;
		
		//убираем кнопки
		objects.game_buttons_cont.visible = false;
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC ) {
			sound.play('lose');
		}
		else 
		{
			if (game_platform === 'CRAZYGAMES') {
				window.CrazyGames.SDK.game.happytime();
			}
			sound.play('win');			
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
		
		await big_message.show(result_info, ['Рейтинг','Rating'][LANG]+`: ${old_rating} > ${my_data.rating}`,true)
	
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
		
	async send_move() {
		
		let root_node = new node_class(game.field, MY_ID, 0);
		let best_child = await this.start_mm_search(root_node);
		if (!best_child) return;
		game.receive_move(best_child.move_data);
		
	},
	
	async activate() {
		
				
		set_state({state : 'b'});	

		//показываем кнопку стоп
		objects.stop_bot_button.visible = true;
		objects.stop_bot_button.pointerdown=function(){game.stop_down()};
		
		const opp_chip=irnd(0,17);
		objects.opp_icon.texture = assets['chip'+opp_chip];	
		
		objects.opp_card_name.text='Bot';
		objects.opp_card_rating.text='1400'
		objects.opp_avatar.texture=assets.pc_icon;			
			
		
		//это если фишки совпадают
		if (opp_chip===my_data.chip)
			objects.opp_icon.tint=0x88ff88;
		else
			objects.opp_icon.tint=0xffffff;
		
		//Ход вместо таймера...........................
		this.reset_timer();
		objects.timer_cont.visible = true;
		objects.timer_text.text  = ['мой ход','my turn'][LANG];
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
			
		//убираем кнопку стоп и таймер
		objects.stop_bot_button.visible=false;
		objects.timer_cont.visible=false;
				
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			sound.play('lose');
		else
			sound.play('win');		
		
		await big_message.show(result_info, ['Сыграйте с реальным соперником для получения рейтинга','Play online with other player to increase rating'][LANG],true)
	
	},
	
	silent_stop() {
		
		
		//убираем кнопку стоп
		objects.stop_bot_button.visible=false;
		
		
	},
	
	reset_timer() {
		
		objects.timer_bcg.tint=0xbbbbff;	
		objects.timer_cont.x = [650,10][my_turn];	
		
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

keyboard={
	
	ru_keys:[[38,105.05,72.02,144.12,'1'],[82.64,105.05,116.66,144.12,'2'],[127.27,105.05,161.29,144.12,'3'],[171.91,105.05,205.93,144.12,'4'],[216.55,105.05,250.57,144.12,'5'],[261.18,105.05,295.2,144.12,'6'],[305.82,105.05,339.84,144.12,'7'],[350.45,105.05,384.47,144.12,'8'],[395.09,105.05,429.11,144.12,'9'],[439.73,105.05,473.75,144.12,'0'],[529,105.05,579,144.12,'<'],[72,153.88,106.02,192.95,'Й'],[112.73,153.88,146.75,192.95,'Ц'],[153.45,153.88,187.47,192.95,'У'],[194.18,153.88,228.2,192.95,'К'],[234.91,153.88,268.93,192.95,'Е'],[275.64,153.88,309.66,192.95,'Н'],[316.36,153.88,350.38,192.95,'Г'],[357.09,153.88,391.11,192.95,'Ш'],[397.82,153.88,431.84,192.95,'Щ'],[438.55,153.88,472.57,192.95,'З'],[479.27,153.88,513.29,192.95,'Х'],[520,153.88,554.02,192.95,'Ъ'],[100.75,202.72,134.77,241.79,'Ф'],[141.5,202.72,175.52,241.79,'Ы'],[182.25,202.72,216.27,241.79,'В'],[223,202.72,257.02,241.79,'А'],[263.75,202.72,297.77,241.79,'П'],[304.5,202.72,338.52,241.79,'Р'],[345.25,202.72,379.27,241.79,'О'],[386,202.72,420.02,241.79,'Л'],[426.75,202.72,460.77,241.79,'Д'],[467.5,202.72,501.52,241.79,'Ж'],[508.25,202.72,542.27,241.79,'Э'],[76,251.56,110.02,290.63,'!'],[117.09,251.56,151.11,290.63,'Я'],[158.18,251.56,192.2,290.63,'Ч'],[199.27,251.56,233.29,290.63,'С'],[240.36,251.56,274.38,290.63,'М'],[281.45,251.56,315.47,290.63,'И'],[322.55,251.56,356.57,290.63,'Т'],[363.64,251.56,397.66,290.63,'Ь'],[404.73,251.56,438.75,290.63,'Б'],[445.82,251.56,479.84,290.63,'Ю'],[528,251.56,562.02,290.63,')'],[484.36,105.05,518.38,144.12,'?'],[29,300.4,179,339.47,'ЗАКРЫТЬ'],[200,300,421,339.07,' '],[441,300,590,339.07,'ОТПРАВИТЬ'],[549,202.72,583.02,241.79,','],[486.91,251.56,520.93,290.63,'('],[40,202.72,90,241.79,'EN']],
	en_keys:[[40.7,106.05,78.5,145.12,'1'],[85.9,106.05,123.7,145.12,'2'],[131.09,106.05,168.89,145.12,'3'],[176.28,106.05,214.08,145.12,'4'],[221.48,106.05,259.28,145.12,'5'],[266.67,106.05,304.47,145.12,'6'],[311.86,106.05,349.66,145.12,'7'],[357.06,106.05,394.86,145.12,'8'],[402.25,106.05,440.05,145.12,'9'],[447.44,106.05,485.24,145.12,'0'],[537.83,106.05,589.43,145.12,'<'],[97.63,154.88,135.43,193.95,'Q'],[141.46,154.88,179.26,193.95,'W'],[185.3,154.88,223.1,193.95,'E'],[229.14,154.88,266.94,193.95,'R'],[272.97,154.88,310.77,193.95,'T'],[316.81,154.88,354.61,193.95,'Y'],[360.65,154.88,398.45,193.95,'U'],[404.48,154.88,442.28,193.95,'I'],[448.32,154.88,486.12,193.95,'O'],[492.16,154.88,529.96,193.95,'P'],[114.27,203.72,152.07,242.79,'A'],[158.17,203.72,195.97,242.79,'S'],[202.08,203.72,239.88,242.79,'D'],[245.98,203.72,283.78,242.79,'F'],[289.89,203.72,327.69,242.79,'G'],[333.8,203.72,371.6,242.79,'H'],[377.7,203.72,415.5,242.79,'J'],[421.61,203.72,459.41,242.79,'K'],[465.52,203.72,503.32,242.79,'L'],[486.19,252.56,523.99,291.63,'('],[73.34,252.56,111.14,291.63,'!'],[146.91,252.56,184.71,291.63,'Z'],[193.19,252.56,230.99,291.63,'X'],[239.47,252.56,277.27,291.63,'C'],[285.75,252.56,323.55,291.63,'V'],[332.03,252.56,369.83,291.63,'B'],[378.31,252.56,416.11,291.63,'N'],[424.59,252.56,462.39,291.63,'M'],[530.47,252.56,568.27,291.63,')'],[492.64,106.05,530.44,145.12,'?'],[31,300.93,185.8,340,'ЗАКРЫТЬ'],[196.12,300.93,433.49,340,' '],[443.81,300.93,588.29,340,'ОТПРАВИТЬ'],[549.11,203.72,586.91,242.79,','],[36.06,203.72,87.66,242.79,'RU']],
	
	layout:0,
	resolver:0,
	
	MAX_SYMBOLS : 60,
	
	read(max_symb){
		
		this.MAX_SYMBOLS=max_symb||60;
		
		
		if (LANG===1){
			this.layout=this.en_keys;
			objects.chat_keyboard.texture=assets.eng_layout;
		}else{
			this.layout=this.ru_keys;
			objects.chat_keyboard.texture=assets.rus_layout;
		}
		

		//если какой-то ресолвер открыт
		if(this.resolver) this.resolver('');
		
		objects.chat_keyboard_text.text ='';
		objects.chat_keyboard_control.text = this.MAX_SYMBOLS;
				
		anim2.add(objects.chat_keyboard_cont,{y:[450, objects.chat_keyboard_cont.sy],alpha:[0,1]}, true, 0.2,'linear');	


		return new Promise(resolve=>{			
			this.resolver=resolve;			
		})
		
	},
	
	keydown (key) {		
		
		//*******это нажатие с клавиатуры
		if(!objects.chat_keyboard_cont.visible) return;	
		
		key = key.toUpperCase();
		
		if(key==='BACKSPACE') key ='<';
		if(key==='ENTER') key ='ОТПРАВИТЬ';
		if(key==='ESCAPE') key ='ЗАКРЫТЬ';
		
		var key2 = this.layout.find(k => {return k[4] === key})			
				
		this.process_key(key2)		
		
	},
	
	get_key_from_touch(e){
		
		//координаты нажатия в плостоки спрайта клавиатуры
		let mx = e.data.global.x/app.stage.scale.x - objects.chat_keyboard_cont.x-10;
		let my = e.data.global.y/app.stage.scale.y - objects.chat_keyboard_cont.y-10;
		
		//ищем попадание нажатия на кнопку
		let margin = 5;
		for (let k of this.layout)	
			if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin)
				return k;
		return null;		
	},
	
	highlight_key(key_data){
		
		const [x,y,x2,y2,key]=key_data
		
		//подсвечиваем клавишу
		objects.chat_keyboard_hl.width=20+x2-x;
		objects.chat_keyboard_hl.height=20+y2-y;
		
		objects.chat_keyboard_hl.x = x+objects.chat_keyboard.x-10;
		objects.chat_keyboard_hl.y = y+objects.chat_keyboard.y-11;	
		
		anim2.add(objects.chat_keyboard_hl,{alpha:[1, 0]}, false, 0.5,'linear');
		
	},	
	
	pointerdown (e) {
		
		//if (!game.on) return;
				
		//получаем значение на которое нажали
		const key=this.get_key_from_touch(e);
		
		//дальнейшая обработка нажатой команды
		this.process_key(key);	
	},
	
	response_message(uid, name) {
		
		objects.chat_keyboard_text.text = name.split(' ')[0]+', ';	
		objects.chat_keyboard_control.text = `${objects.chat_keyboard_text.text.length}/${keyboard.MAX_SYMBOLS}`		
		
	},
	
	switch_layout(){
		
		if (this.layout===this.ru_keys){			
			this.layout=this.en_keys;
			objects.chat_keyboard.texture=assets.eng_layout;
		}else{			
			this.layout=this.ru_keys;
			objects.chat_keyboard.texture=assets.rus_layout;
		}
		
	},
	
	process_key(key_data){

		if(!key_data) return;	

		let key=key_data[4];	

		//звук нажатой клавиши
		sound.play('keypress');				
		
		const t=objects.chat_keyboard_text.text;
		if ((key==='ОТПРАВИТЬ'||key==='SEND')&&t.length>0){
			this.resolver(t);	
			this.close();
			key ='';		
		}

		if (key==='ЗАКРЫТЬ'||key==='CLOSE'){
			this.resolver(0);			
			this.close();
			key ='';		
		}
		
		if (key==='RU'||key==='EN'){
			this.switch_layout();
			key ='';		
		}
		
		if (key==='<'){
			objects.chat_keyboard_text.text=t.slice(0, -1);
			key ='';		
		}
		
		if (t.length>=this.MAX_SYMBOLS) return;
		
		//подсвечиваем...
		this.highlight_key(key_data);			

		//добавляем значение к слову
		if (key.length===1) objects.chat_keyboard_text.text+=key;
		
		objects.chat_keyboard_control.text=this.MAX_SYMBOLS-objects.chat_keyboard_text.text.length;		
		
	},
	
	close () {		
		
		//на всякий случай уничтожаем резолвер
		if (this.resolver) this.resolver(0);
		anim2.add(objects.chat_keyboard_cont,{y:[objects.chat_keyboard_cont.y,450],alpha:[1,0]}, false, 0.2,'linear');		
		
	},
	
}

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
					wall.x = objects.field.x + FIELD_MARGIN_X + c * 50;
					wall.y = objects.field.y + FIELD_MARGIN_Y + r * 50;
					wall.texture=assets.v_wall;										
					wall.visible = true;
					wall_iter++;
				}
				
				if (cell.wall_type === H_WALL) {
					wall.height=40;
					wall.width=140;
					wall.tint=[0xaaaaaa,0xffffff,0xff7777][cell.wall_owner];
					wall.x = objects.field.x + FIELD_MARGIN_X + c * 50;
					wall.y = objects.field.y + FIELD_MARGIN_Y + r * 50;
					wall.texture=assets.h_wall;					
					wall.visible = true;
					wall_iter++;
				}				
				
				if (cell.player === MY_ID) {					
					objects.my_icon.x = objects.field.x + FIELD_MARGIN_X + c * 50;
					objects.my_icon.y = objects.field.y + FIELD_MARGIN_Y + r * 50;
					objects.my_icon.visible = true;					
				}
				
				if (cell.player === OPP_ID) {					
					objects.opp_icon.x = objects.field.x + FIELD_MARGIN_X + c * 50;
					objects.opp_icon.y = objects.field.y + FIELD_MARGIN_Y + r * 50;
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
		
		if (c < 1)	return 0;		
		if (r < 1)	return 0;		
		if (c > 8)	return 0;		
		if (r > 8)	return 0;
		
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
			message.add(['Вы ходите первым. Последний ход за соперником.','You go first. The last move is for the opponent'][LANG]);

		} else {
			my_turn = 0;			
			message.add(['Вы ходите вторым. Последний ход за Вами.','You go second. The last move is yours'][LANG])
		}
		
		
		objects.my_icon.texture = assets['chip'+my_data.chip];
		objects.opp_icon.tint=0x88ff88;
		
		//это то что могло остаться от игры с ботом
		objects.move_opt_cont.visible=false;
		objects.my_icon.alpha=1;
		some_process.player_selected_processing = function(){};
				
		//инициируем все что связано с оппонентом
		await this.opponent.activate(my_role);
				
		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
				
		//воспроизводим звук о начале игры
		sound.play('game_start');
		
				
		//восстанавливаем мое имя так как оно могло меняться
		objects.my_card_name.set2(my_data.name,150);
		objects.my_card_rating.text = my_data.rating;
				
		//показываем карточки игроков		
		objects.my_card_cont.visible = true;
		objects.opp_card_cont.visible = true;		
		
		//устанавливаем мою аватарку
		objects.my_avatar.texture=players_cache.players[my_data.uid].texture;
		
		//отключаем взаимодейтсвие с доской
		objects.field.pointerdown = this.mouse_down.bind(game);		
			
		//формируем игровое поле
		ffunc.init(this.field);	

		//показываем игровое поле
		objects.field.visible = true;		
		

		//обозначаем какой сейчас ход
		made_moves = 0;
		objects.cur_move_text.visible = true;
		objects.cur_move_text.text=['Ход: ','Move: '][LANG] + made_moves;
				
		//количество стен
		this.wall_num = [10,10];
		objects.my_walls.text = ['Стены: ','Walls: '][LANG]+this.wall_num[0];
		objects.opp_walls.text = ['Стены: ','Walls: '][LANG]+this.wall_num[1];
		
		//плавно добавляем фигуры
		objects.my_icon.x = objects.field.x + FIELD_MARGIN_X + 4 * 50;
		objects.opp_icon.x = objects.field.x + FIELD_MARGIN_X + 4 * 50;
		
		anim2.add(objects.my_icon,{y:[450, 400]}, true, 0.5,'linear');	
		await anim2.add(objects.opp_icon,{y:[-50, 0]}, true, 0.5,'linear');	
		
		//обновляем поле
		ffunc.draw(this.field)	

		this.update_moves_to_win(this.field);
		
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
			sound.play('bad_move');
			return;			
		}
		
		//отправляем сопернику что мы сдались
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"GIVEUP",tm:Date.now()});
		this.stop('my_giveup')
		
		
	},
	
	stop_down() {
		
		
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true) {
			sound.play('bad_move');
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
			sound.play('bad_move');
			return;			
		}
		
		//координаты указателя
		let mx = e.data.global.x/app.stage.scale.x;
		let my = e.data.global.y/app.stage.scale.y;

		//координаты указателя на игровой доске
		const _c = Math.floor(9*(mx-objects.field.x-FIELD_MARGIN_X)/450);
		const _r = Math.floor(9*(my-objects.field.y-FIELD_MARGIN_Y)/450);
		const _id = _c + _r * 8;
		let p = this.field.pos[MY_ID]; p ={r:p.r, c:p.c};
		
		const player_cell_selected = (p.r === _r && p.c === _c);
		
		//выбрана ячейка с игроком
		if (player_cell_selected === true  && this.selected === null) {			
						
			sound.play('checker_tap');
			
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

			sound.play('checker_tap');			
						
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
		
		let x1 = objects.field.x + FIELD_MARGIN_X + c1 * 50;
		let y1 = objects.field.y + FIELD_MARGIN_Y + r1 * 50;
		let x2 = objects.field.x + FIELD_MARGIN_X + c2 * 50;
		let y2 = objects.field.y + FIELD_MARGIN_Y + r2 * 50;
									
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
		
		sound.play('place_wall');
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
	
	update_moves_to_win(field){
		
		//определяем сколько ходов осталось
		const my_root=new node_class(field, MY_ID, 0)
		let moves_left=ffunc.get_shortest_distance_to_target(my_root.field,MY_ID,ROW0)
		objects.my_moves_to_win.text=moves_left+' moves to finish';

		const opp_root=new node_class(field, OPP_ID, 0)
		moves_left=ffunc.get_shortest_distance_to_target(opp_root.field,OPP_ID,ROW8)
		objects.opp_moves_to_win.text=moves_left+' moves to finish';		
		
	},
	
	process_move(data) {
				
		//отправляем ход сопернику
		this.opponent.send_move(data);		

		this.update_moves_to_win(this.field);		
	
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

		this.opponent.me_conf_play=1;
		this.opponent.reset_timer();	
					
		
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
		sound.play('cancel_wall');
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

		sound.play('iter_wall');
					
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
					w_spr.texture=assets.v_wall;					
				}
				
				if (wp[0] === H_WALL) {					
					w_spr = objects.h_wall;
					w_spr.texture=assets.h_wall;				
				}
								
				w_spr.visible = true;
				w_spr.y = r * 50 + objects.field.y + FIELD_MARGIN_Y;				
				w_spr.x = c * 50 + objects.field.x + FIELD_MARGIN_X;

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
			objects.move_opt[i].x = objects.field.x + FIELD_MARGIN_X + moves[i].c1 * 50;
			objects.move_opt[i].y = objects.field.y + FIELD_MARGIN_Y + moves[i].r1 * 50;			
			this.av_moves.push(moves[i].r1.toString() + moves[i].c1.toString());			
		}

	},
	
	async receive_move(data) {
		
		if (data.type === 'move') {
			
			sound.play('checker_tap');
			let p = this.field.pos[OPP_ID];			
			await this.update_player_pos(objects.opp_icon, data.r0, data.c0, data.r1, data.c1);			
			ffunc.make_move(this.field, data.r0, data.c0, data.r1, data.c1)
			sound.play('checker_tap');
		}
		
		if (data.type === 'wall') {
			
			sound.play('place_wall');
			
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
		
		this.update_moves_to_win(this.field);		
		
	}

}

game_watching={
	
	game_id:0,
	field:{},
	on:false,
	anchor_uid:'',
	master_uid:'',
	slave_uid:'',
	
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
		const chip1 = await fbs_once('players/'+card_data.uid1+'/chip')||0;
		const chip2 = await fbs_once('players/'+card_data.uid2+'/chip')||0;
			
		
		//фишки
		
		//это если фишки совпадают
		if (chip1===chip2)
			objects.picon1.tint=objects.opp_icon.tint=0x88ff88;
		else
			objects.picon1.tint=objects.opp_icon.tint=0xffffff;
		
		objects.my_icon.texture =objects.picon0.texture=assets['chip'+chip1];
		objects.opp_icon.texture =objects.picon1.texture=assets['chip'+chip2];
		
		objects.picon0.visible=objects.picon1.visible=true;
		
		//аватарки		
		const main_data=await fbs_once('tables/'+this.game_id);
		
		const master_data=players_cache.players[card_data.uid1];
		const slave_data=players_cache.players[card_data.uid2];
		objects.my_avatar.texture=master_data.texture;
		objects.opp_avatar.texture=slave_data.texture;	
		
		//имена
		objects.my_card_name.set2(card_data.name1,150);
		objects.opp_card_name.set2(card_data.name2,150);
		
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
		lobby.activate();		
	},
	
	async new_move(data){
		
		if(data===null || data===undefined)
			return;
		
		if(data.fin_flag){
			await big_message.show("This game is finished",")))",false);
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
			this.field.pos[MY_ID].r=my_r;
			this.field.pos[MY_ID].c=my_c;
			this.field.pos[OPP_ID].r=opp_r;
			this.field.pos[OPP_ID].c=opp_c;
			
		} else {
			this.field.f[8-my_r][8-my_c].player=OPP_ID;
			this.field.f[8-opp_r][8-opp_c].player=MY_ID;			
			objects.opp_walls.text = ['Стены: ','Walls: '][LANG]+walls_num1;
			objects.my_walls.text = ['Стены: ','Walls: '][LANG]+walls_num2;
			this.field.pos[MY_ID].r=8-opp_r;
			this.field.pos[MY_ID].c=8-opp_c;
			this.field.pos[OPP_ID].r=8-my_r;
			this.field.pos[OPP_ID].c=8-my_c;
		}

		ffunc.draw(this.field); 
		
		game.update_moves_to_win(this.field);
		
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
		this.on=false;

	}
	
}

game_tutor={

	time:0,
	timeline:null,	
	next_frame:0,
	resolver:0,
	on:0,
		
	async start(){		


		//ссылки на стены
		for(let w=0;w<6;w++){
			objects['w'+w]=objects.walls[w];			
			objects['w'+w].scale_xy=0.6666666;
			objects['w'+w].width=140;
			objects['w'+w].height=40;
		}
		
		if (!this.timeline){
			const d1=await fetch(git_src+'timeline.txt')
			const d2=await d1.text();
			this.timeline=eval(d2);			
		}

		
		this.on=1;
		
		objects.my_icon.texture = assets['chip4'];
		objects.opp_icon.texture = assets['chip5'];
		
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
		objects.my_avatar.texture=assets['chip4'];
		objects.my_card_rating.text='-';
		
		objects.opp_card_cont.visible = true;		
		objects.opp_card_name.text=['Игрок 2', 'Player 2'][LANG];
		objects.opp_avatar.texture=assets['chip5'];
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
		objects.my_icon.x = objects.field.x + FIELD_MARGIN_X + 4 * 50;
		objects.my_icon.r=8;
		objects.my_icon.c=4;
		
		objects.opp_icon.x = objects.field.x + FIELD_MARGIN_X + 4 * 50;
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
		sound.play('click')
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
								objects[obj][p]=assets[val];
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
							sound.play('close_it');
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

players_cache={
	
	players:{},
		
	async my_texture_from(pic_url, timeoutMs = 3000){
		
		// If this is a multavatar
		if (pic_url.includes('mavatar')) pic_url = multiavatar(pic_url);

		// Create a timeout promise
		const timeoutPromise = new Promise((_, reject) =>
		setTimeout(() => reject(new Error('Timeout: Failed to load texture within the specified time')), timeoutMs)
		);

		try {
			// Race the texture loading against the timeout
			const texture = await Promise.race([
			PIXI.Texture.fromURL(pic_url), // The actual texture loading
			timeoutPromise // The timeout
		]);
		return texture;
		} catch (er) {
			console.error(er); // Optionally log the error
			return PIXI.Texture.WHITE; // Return a default white texture on error or timeout
		}

	},
	
	async update(uid,params={}){
				
		//если игрока нет в кэше то создаем его
		if (!this.players[uid]) this.players[uid]={}
							
		//ссылка на игрока
		const player=this.players[uid];
		
		//заполняем параметры которые дали
		for (let param in params) player[param]=params[param];
		
		if (!player.name) player.name=await fbs_once('players/'+uid+'/name');
		if (!player.rating) player.rating=await fbs_once('players/'+uid+'/rating');
	
		//извлекаем страну если она есть в отдельную категорию и из имени убираем
		const country =auth2.get_country_from_name(player.name);
		if (country){			
			player.country=country;
			player.name=player.name.slice(0, -4);
		}
	},
	
	async update_avatar(uid){
		
		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);
		
		//если текстура уже есть
		if (player.texture) return;
		
		//если нет URL
		if (!player.pic_url) player.pic_url=await fbs_once('players/'+uid+'/pic_url');
		
		if(player.pic_url==='https://vk.com/images/camera_100.png')
			player.pic_url='https://akukamil.github.io/domino/vk_icon.png';
				
		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);		
		
	},
	
	async update_avatar_forced(uid, pic_url){
		
		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);
						
		if(pic_url==='https://vk.com/images/camera_100.png')
			pic_url='https://akukamil.github.io/domino/vk_icon.png';
				
		//сохраняем
		player.pic_url=pic_url;
		
		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);	
		
	},
	
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

var kill_game = function() {
	
	firebase.app().delete();
	document.body.innerHTML = 'CLIENT TURN OFF';
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
		lobby.accepted_invite();
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player===msg.sender) {
		lobby.rejected_invite();
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

	//айди клиента для удаления дубликатов
	if (msg.message==='CLIEND_ID') 
		if (msg.client_id !== client_id)
			kill_game();

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
	
	async show(uid) {

		//если нет в кэше то загружаем из фб
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		
		const player=players_cache.players[uid];
		
		sound.play('receive_sticker');	
		
		anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.75,'easeOutElastic');
							
		//Отображаем  имя и фамилию в окне приглашения
		req_dialog._opp_data.uid=uid;		
		req_dialog._opp_data.name=player.name;		
		req_dialog._opp_data.rating=player.rating;
				
		objects.req_name.set2(player.name,200);
		objects.req_rating.text=player.rating;
		
		objects.req_avatar.texture=player.texture;


	},

	reject() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;
		
		sound.play('close_it');

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

		fbs.ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept() {

		if (!objects.req_cont.ready|| !objects.req_cont.visible||objects.big_message_cont.visible|| anim2.any_on())
			return;
		
		//только когда бот сделал ход
		if (state ==='b' && my_turn === 0)
			return;
		
		//устанавливаем окончательные данные оппонента
		opp_data = req_dialog._opp_data;	
	
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*99999);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),game_id});

		//заполняем карточку оппонента
		objects.opp_card_name.set2(opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		lobby.close();
		game.activate("slave" , online_game );

	},

	hide() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;
	
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

	}

}

pref={
	
	chip_id:0,
	cur_pic_url:'',
	avatar_switch_center:0,
	avatar_swtich_cur:0,
	last_serv_tm_check:0,
	hours_to_nick_change:0,
	hours_to_photo_change:0,
	info_timer:0,
	ICONS_DATA:{
		0:{rating:0,games:0},
		1:{rating:0,games:0},
		2:{rating:0,games:0},
		3:{rating:0,games:0},
		4:{rating:0,games:0},

		5:{rating:1500,games:200},
		6:{rating:1500,games:200},
		7:{rating:1500,games:200},
		8:{rating:1500,games:200},
		9:{rating:1500,games:200},
		
		10:{rating:1600,games:400},
		11:{rating:1600,games:400},
		12:{rating:1600,games:400},
		13:{rating:1600,games:400},
		14:{rating:1600,games:400},
		
		15:{rating:1800,games:1000},
		16:{rating:1800,games:1000},
		17:{rating:1800,games:1000},
		18:{rating:1800,games:1000},
		19:{rating:1800,games:1000},		
	},
	
	activate(){
		
		
		//показываем какие иконки доступны
		for(let i=0;i<20;i++){
			const req=this.ICONS_DATA[i];
			if(my_data.rating>=req.rating||my_data.games>=req.games)
				objects.chip_icons[i].alpha=1;
			else
				objects.chip_icons[i].alpha=0.4;		
			
		}
		
		//отображаем текущий чип
		this.chip_id=my_data.chip;
		objects.chip_sel_frame.x=objects.pref_chip_icons[my_data.chip].x;
		objects.chip_sel_frame.y=objects.pref_chip_icons[my_data.chip].y;
		objects.chip_sel_frame.alpha=0.4;
				
		//заполняем имя и аватар
		objects.pref_name.set2(my_data.name,260);
		objects.pref_avatar.set_texture(players_cache.players[my_data.uid].texture);	
		objects.pref_rating.text=['Рейтинг: ','Rating: '][LANG]+my_data.rating;
		objects.pref_games.text=['Игры: ','Games: '][LANG]+my_data.games;
		
		
		this.update_available_actions();
		this.avatar_switch_center=this.avatar_swtich_cur=irnd(9999,999999);
		
	},
	
	async update_available_actions(){
		
		const tm=Date.now();
		if (tm-this.last_serv_tm_check<30000) return;
		this.last_serv_tm_check=tm;		
		serv_tm=await my_ws.get_tms()||serv_tm;
		
		if (!serv_tm){
			this.send_info(['Ошибка получения серверного времени(((','Server time error!'][LANG]);
			this.update_buttons();
			return;
		}
		
		this.update_buttons();		
	
	},
	
	getHoursEnding(hours) {
		hours = Math.abs(hours) % 100;
		let lastDigit = hours % 10;

		if (hours > 10 && hours < 20) {
			return 'часов';
		} else if (lastDigit == 1) {
			return 'час';
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return 'часа';
		} else {
			return 'часов';
		}
	},
		
	update_buttons(){
		
		objects.pref_conf_photo_btn.visible=false;
		
		//сколько осталось до изменения
		this.hours_to_nick_change=Math.max(0,Math.floor(720-(serv_tm-my_data.nick_tm)*0.001/3600));
		this.hours_to_photo_change=Math.max(0,Math.floor(720-(serv_tm-my_data.avatar_tm)*0.001/3600));
		
		//определяем какие кнопки доступны
		objects.pref_change_name_btn.alpha=(this.hours_to_nick_change>0||my_data.games<200||!serv_tm)?0.5:1;
		objects.pref_arrow_left.alpha=(this.hours_to_photo_change>0||!serv_tm)?0.5:1;
		objects.pref_arrow_right.alpha=(this.hours_to_photo_change>0||!serv_tm)?0.5:1;	
		objects.pref_reset_avatar_btn.alpha=(this.hours_to_photo_change>0||!serv_tm)?0.5:1;	
		
	},
	
	send_info(msg,timeout){
		
		objects.pref_info.text=msg;
		anim2.add(objects.pref_info,{alpha:[0,1]}, true, 0.25,'linear',false);
		clearTimeout(this.info_timer);
		this.info_timer=setTimeout(()=>{
			anim2.add(objects.pref_info,{alpha:[1,0]}, false, 0.25,'linear',false);	
		},timeout||3000);	
	},
	
	check_time(last_time){


		//провряем можно ли менять
		const tm=Date.now();
		const days_since_nick_change=~~((tm-last_time)/86400000);
		const days_befor_change=30-days_since_nick_change;
		const ln=days_befor_change%10;
		const opt=[0,5,6,7,8,9].includes(ln)*0+[2,3,4].includes(ln)*1+(ln===1)*2;
		const day_str=['дней','дня','день'][opt];
		
		if (days_befor_change>0){
			objects.pref_info.text=[`Поменять можно через ${days_befor_change} ${day_str}`,`Wait ${days_befor_change} days`][LANG];
			anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);	
			sound.play('locked');
			return 0;
		}
		
		return 1;
	},
	
	async change_name_down(){
		
		if (!serv_tm){
			this.send_info(['Ошибка получения серверного времени(((','Server time error!'][LANG]);
			sound.play('locked');
			return;
		}
		
		if (my_data.games<200){
			this.send_info(['Нужно сыграть 200 онлайн партий чтобы поменять имя(((','Need to play 200 online games to change!'][LANG]);
			sound.play('locked');
			return;
		}
				
		//провряем можно ли менять ник
		if(this.hours_to_nick_change>0){
			this.send_info(`Имя можно поменять через ${this.hours_to_nick_change} ${this.getHoursEnding(this.hours_to_nick_change)}.`);
			sound.play('locked');
			return;
		} 
		
		
		sound.play('click');
		
		//получаем новое имя
		const name=await keyboard.read(15);
		if (name&&name.replace(/\s/g, '').length>3){			
			
			//обновляем данные о времени
			my_data.nick_tm=serv_tm;
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm);	
						
			my_data.name=name;	
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name);			
			
			this.update_buttons();		
			
			objects.pref_name.set2(name,260);
			this.send_info(['Вы изменили имя)))','Name is changed!'][LANG]);
			sound.play('note');	
			
		}else{			
			this.send_info(['Неправильное имя(((','Invalid name!'][LANG]);
			anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);			
		}		
	},
	
	async reset_avatar_down(){
				
		if (!serv_tm){
			this.send_info(['Ошибка получения серверного времени(((','Server time error!'][LANG]);
			sound.play('locked');
			return;
		}
								
		if (anim2.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}
			
		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info([`Фото можно поменять через ${this.hours_to_photo_change}  ${this.getHoursEnding(this.hours_to_photo_change)}.`,`Wait ${this.hours_to_photo_change} hours to change`][LANG]);
			sound.play('locked');
			return;
		} 		
		
		sound.play('click');
		
		this.cur_pic_url=my_data.orig_pic_url;		
		
		objects.pref_conf_photo_btn.visible=true;
		this.tex_loading=1;
		const t=await players_cache.my_texture_from(my_data.orig_pic_url);
		objects.pref_avatar.set_texture(t);
		this.tex_loading=0;
	},
	
	conf_photo_down(){
		
		my_data.avatar_tm=serv_tm;		
		fbs.ref(`players/${my_data.uid}/pic_url`).set(this.cur_pic_url);
		fbs.ref(`players/${my_data.uid}/avatar_tm`).set(my_data.avatar_tm);			
			
		this.send_info(['Вы изменили фото)))','Your photo has been changed!'][LANG]);
		sound.play('note');	

		this.update_buttons();		
		
		//обновляем аватар в кэше
		players_cache.update_avatar_forced(my_data.uid,this.cur_pic_url).then(()=>{
			const my_card=objects.mini_cards.find(card=>card.uid===my_data.uid);
			my_card.avatar.set_texture(players_cache.players[my_data.uid].texture);				
		})	
			
	},
		
	async arrow_down(dir){
		
		if (!serv_tm){
			this.send_info(['Ошибка получения серверного времени(((','Server time error!'][LANG]);
			sound.play('locked');
			return;
		}
		
		if (anim2.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}				
				
		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info([`Фото можно поменять через ${this.hours_to_photo_change}  ${this.getHoursEnding(this.hours_to_photo_change)}.`,`Wait ${this.hours_to_photo_change} hours to change`][LANG]);
			sound.play('locked');
			return;
		} 	
		
		sound.play('click');
				
		//перелистываем аватары
		this.avatar_swtich_cur+=dir;
		if (this.avatar_swtich_cur===this.avatar_switch_center){
			this.cur_pic_url=players_cache.players[my_data.uid].pic_url
		}else{
			this.cur_pic_url='mavatar'+this.avatar_swtich_cur;
		}		
		
		objects.pref_conf_photo_btn.visible=true;		
		this.tex_loading=1;		
		const t=await players_cache.my_texture_from(multiavatar(this.cur_pic_url));
		objects.pref_avatar.set_texture(t);		
		this.tex_loading=0;				
	
	
	},
		
	sound_btn_down(){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.switch();
		sound.play('click');
		const tar_x=sound.on?370:323; //-38
		anim2.add(objects.pref_sound_slider,{x:[objects.pref_sound_slider.x,tar_x]}, true, 0.1,'linear');	
		
	},
		
	switch_to_lobby(){
		
		this.close();
		
		//показываем лобби
		anim2.add(objects.cards_cont,{x:[800,0]}, true, 0.2,'linear');		
		anim2.add(objects.lobby_footer_cont,{y:[450,objects.lobby_footer_cont.sy]}, true, 0.2,'linear');
		
	},
	
	close(){
		
		//убираем контейнер
		anim2.add(objects.pref_cont,{x:[objects.pref_cont.x,-800]}, false, 0.2,'linear');
		anim2.add(objects.pref_footer_cont,{y:[objects.pref_footer_cont.y,450]}, false, 0.2,'linear');	
		
	},
	
	ok_btn_down(button_data){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		sound.play('click');		
		this.switch_to_lobby();		
	},
	
	conf_icon_down(){
		
		//фиксируем номер фишки если поменялся
		if (my_data.chip!==pref.chip_id){
			my_data.chip=pref.chip_id;
			fbs.ref('players/'+my_data.uid+'/chip').set(my_data.chip);
			this.send_info(['Вы изменили фишку!','Your chip icon is changed!'][LANG]);
			objects.chip_sel_frame.alpha=0.4;
			sound.play('note');	
			const chip_spr=objects.pref_chip_icons[my_data.chip];
			anim2.add(chip_spr,{scale_xy:[0.666, 1],angle:[0,10]}, true, 0.5,'ease2back');	
		}else{
			sound.play('locked');	
			this.send_info(['Это ваша текущая фишка!','This is your current chip!'][LANG]);
		}
	},	
	
	chip_down(){
		
		

		const req=pref.ICONS_DATA[this.chip_id];
		if(my_data.rating<req.rating&&my_data.games<req.games){		
			sound.play('locked');	
			anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);	
			objects.pref_info.text=[`Нужно: рейтинг>${req.rating} или игры>${req.games}`,`Need: rating>${req.rating} or games>${req.games}`][LANG];
			return;
		}		
		
		sound.play('click');	
		//если это уже выбранная фишка
		if (my_data.chip===this.chip_id)
			objects.chip_sel_frame.alpha=0.4;
		else
			objects.chip_sel_frame.alpha=1;
		
		
		
		objects.chip_sel_frame.x=this.x;
		objects.chip_sel_frame.y=this.y;
		pref.chip_id=this.chip_id;
		
	},
	
}

ad={
			
	show : function() {
		
		if (game_platform==="YANDEX") {			
			//показываем рекламу
			PIXI.sound.volumeAll=0;
			window.ysdk.adv.showFullscreenAdv({
			  callbacks: {
				onClose: function() {PIXI.sound.volumeAll=1;}, 
				onError: function() {PIXI.sound.volumeAll=1;}
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
			sound.play('bad_move');
			return;			
		}

		sound.play('click');

		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy]}, true, 0.5,'easeOutBack');

	},

	hide_panel: function() {

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	send : async function(id) {

		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true || objects.stickers_cont.ready===false) {
			sound.play('bad_move');
			return;			
		}
		
		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		message.add(['Стикер отправлен сопернику','Sticker was sent to the opponent'][LANG]);

		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=assets['sticker_texture_'+id];
		
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

		objects.rec_sticker_area.texture=assets['sticker_texture_'+id];
	
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

	
	activate() {
		
		//objects.tutor_button.visible=false;
		//просто добавляем контейнер с кнопками
		objects.desktop.texture=assets.desktop;
		objects.desktop.visible = true;
		
		//anim2.add(objects.maze_logo_top,{alpha: [0,1]}, true, 1,'easeInOutCubic');
		anim2.add(objects.maze_logo,{alpha: [0,1],y:[-200, objects.maze_logo.sy]}, true, 1,'linear');
		anim2.add(objects.main_buttons_cont,{y:[450, objects.main_buttons_cont.sy],alpha: [0,1]}, true, 0.75,'linear');
				
		anim2.add(objects.flame_0,{alpha: [0,1]}, true, 0.5,'linear');
		anim2.add(objects.flame_1,{alpha: [0,1]}, true, 0.2,'linear');
		
		objects.flame_0.play();
		objects.flame_1.play();
		
		objects.flame_0.animationSpeed=0.25;
		objects.flame_1.animationSpeed=0.25;
	},	

	async close() {

		anim2.add(objects.maze_logo,{alpha: [1,0]}, false, 0.5,'linear');
		anim2.add(objects.main_buttons_cont,{y:[ objects.main_buttons_cont.y, 450],alpha: [1,0]}, true, 0.5,'linear');
		anim2.add(objects.flame_0,{alpha: [1,0]}, false, 0.5,'linear');
		anim2.add(objects.flame_1,{alpha: [1,0]}, false, 0.2,'linear');
	},

	play_button_down: async function () {

		if (objects.big_message_cont.visible === true || objects.id_cont.visible === true || objects.req_cont.visible === true ||  objects.main_buttons_cont.ready === false) {
			sound.play('bad_move');
			return;			
		}


		sound.play('click');

		await this.close();
		lobby.activate();

	},

	lb_button_down () {

		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true ||  objects.main_buttons_cont.ready === false) {
			sound.play('bad_move');
			return;			
		}

		sound.play('click');

		this.close();
		lb.show();

	},

	rules_button_down () {

		if (objects.big_message_cont.visible|| objects.req_cont.visible|| !objects.main_buttons_cont.ready||!objects.rules_cont.ready) {
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
		
		if (objects.big_message_cont.visible|| objects.req_cont.visible||anim2.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('click')
		this.close();
		game_tutor.start();
		
	},

	rules_ok_down () {
		
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true ||  objects.rules_cont.ready === false) {
			sound.play('bad_move');
			return;			
		}
		
		sound.play('click');
		

		
		anim2.add(objects.rules_cont,{y:[objects.rules_cont.y,-450, ]}, false, 0.5,'easeInBack');
	},

	async chat_button_down() {
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		
		chat.activate();
		
		
	},
	


}

chat={
	
	last_record_end : 0,
	drag : false,
	data:[],
	touch_y:0,
	drag_chat:false,
	drag_sx:0,
	drag_sy:-999,	
	recent_msg:[],
	moderation_mode:0,
	block_next_click:0,
	kill_next_click:0,
	delete_message_mode:0,
	games_to_chat:-1,
	payments:0,
	processing:0,
	
	activate() {	

		anim2.add(objects.chat_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		objects.desktop.texture=assets.lobby_bcg;
		objects.chat_enter_btn.visible=my_data.games>=this.games_to_chat;
		
		objects.chat_rules.visible=false;
		//objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		if(my_data.blocked) objects.chat_rules.text='Вы не можете писать в чат, так как вы находитесь в черном списке';

	},
	
	async init(){
		
		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;		
		objects.desktop.interactive=true;
		objects.desktop.pointermove=this.pointer_move.bind(this);
		objects.desktop.pointerdown=this.pointer_down.bind(this);
		objects.desktop.pointerup=this.pointer_up.bind(this);
		objects.desktop.pointerupoutside=this.pointer_up.bind(this);
		
		for(let rec of objects.chat_records) {
			rec.visible = false;			
			rec.msg_id = -1;	
			rec.tm=0;
		}		

		this.init_yandex_payments();

		await my_ws.init();	

		//загружаем чат		
		const chat_data=await my_ws.get('chat',25);
		
		await this.chat_load(chat_data);
		
		//подписываемся на новые сообщения
		my_ws.ss_child_added('chat',chat.chat_updated.bind(chat))
		
		console.log('Чат загружен!')
	},	
	
	init_yandex_payments(){
				
		if (game_platform!=='YANDEX') return;			
				
		if(this.payments) return;
		
		ysdk.getPayments({ signed: true }).then(_payments => {
			chat.payments = _payments;
		}).catch(err => {})			
		
	},	

	fix_name(uid){
		
		fbs.ref('players/'+uid+'/name').set(auth.get_random_name(uid));
		fbs.ref('players/'+uid+'/nick_tm').set(2728556930444);
		
	},

	get_oldest_index () {
		
		let oldest = {tm:9671801786406 ,visible:true};		
		for(let rec of objects.chat_records)
			if (rec.tm < oldest.tm)
				oldest = rec;	
		return oldest.index;		
		
	},
	
	get_oldest_or_free_msg () {
		
		//проверяем пустые записи чата
		for(let rec of objects.chat_records)
			if (!rec.visible)
				return rec;
		
		//если пустых нет то выбираем самое старое
		let oldest = {tm:9671801786406};		
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;	
		return oldest;		
		
	},
		
	block_player(uid){
		
		fbs.ref('blocked/'+uid).set(Date.now());
		fbs.ref('inbox/'+uid).set({message:'CHAT_BLOCK',tm:Date.now()});
		
		//увеличиваем количество блокировок
		fbs.ref('players/'+uid+'/block_num').transaction(val=> {return (val || 0) + 1});
		
	},
		
	async chat_load(data) {
		
		if (data === null) return;
		
		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);
		
		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});
			
		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c,true);	
		
	},	
				
	async chat_updated(data, first_load) {		
	
		//console.log('receive message',data)
		if(data===undefined||!data.msg||!data.name||!data.uid) return;
				
		//ждем пока процессинг пройдет
		for (let i=0;i<10;i++){			
			if (this.processing)
				await new Promise(resolve => setTimeout(resolve, 250));				
			else
				break;				
		}
		if (this.processing) return;
		
		this.processing=1;
		
		//выбираем номер сообщения
		const new_rec=this.get_oldest_or_free_msg();
		const y_shift=await new_rec.set(data);
		new_rec.y=this.last_record_end;
		
		this.last_record_end += y_shift;		

		if (!first_load)
			lobby.inst_message(data);
		
		//смещаем на одно сообщение (если чат не видим то без твина)
		if (objects.chat_cont.visible)
			await anim2.add(objects.chat_msg_cont,{y:[objects.chat_msg_cont.y,objects.chat_msg_cont.y-y_shift]},true, 0.05,'linear');		
		else
			objects.chat_msg_cont.y-=y_shift
		
		this.processing=0;
		
	},
						
	avatar_down(player_data){
		
		if (this.moderation_mode){
			console.log(player_data.index,player_data.uid,player_data.name.text,player_data.msg.text);
			fbs_once('players/'+player_data.uid+'/games').then((data)=>{
				console.log('сыграно игр: ',data)
			})
		}
		
		if (this.block_next_click){			
			this.block_player(player_data.uid);
			console.log('Игрок заблокирован: ',player_data.uid);
			this.block_next_click=0;
		}
		
		if (this.kill_next_click){			
			fbs.ref('inbox/'+player_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id:999999});
			console.log('Игрок убит: ',player_data.uid);
			this.kill_next_click=0;
		}
		
		if(this.delete_message_mode){			
			fbs.ref(`${chat_path}/${player_data.index}`).remove();
			console.log(`сообщение ${player_data.index} удалено`)
		}
		
		
		if(this.moderation_mode||this.block_next_click||this.kill_next_click||this.delete_message_mode) return;
		
		if (objects.chat_keyboard_cont.visible)		
			keyboard.response_message(player_data.uid,player_data.name.text);
		else
			lobby.show_invite_dialog_from_chat(player_data.uid,player_data.name.text);
		
		
	},
			
	get_abs_top_bottom(){
		
		let top_y=999999;
		let bot_y=-999999
		for(let rec of objects.chat_records){
			if (rec.visible===true){
				const cur_abs_top=objects.chat_msg_cont.y+rec.y;
				const cur_abs_bot=objects.chat_msg_cont.y+rec.y+rec.height;
				if (cur_abs_top<top_y) top_y=cur_abs_top;
				if (cur_abs_bot>bot_y) bot_y=cur_abs_bot;
			}		
		}
		
		return [top_y,bot_y];				
		
	},
	
	back_btn_down(){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		this.close();
		lobby.activate();
		
	},
	
	pointer_move(e){		
	
		if (!this.drag_chat) return;
		const mx = e.data.global.x/app.stage.scale.x;
		const my = e.data.global.y/app.stage.scale.y;
		
		const dy=my-this.drag_sy;		
		this.drag_sy=my;
		
		this.shift(dy);

	},
	
	pointer_down(e){
		
		const px=e.data.global.x/app.stage.scale.x;
		this.drag_sy=e.data.global.y/app.stage.scale.y;
		
		this.drag_chat=true;
		objects.chat_cont.by=objects.chat_cont.y;				

	},
	
	pointer_up(){
		
		this.drag_chat=false;
		
	},
	
	shift(dy) {				
		
		const [top_y,bot_y]=this.get_abs_top_bottom();
		
		//проверяем движение чата вверх
		if (dy<0){
			const new_bottom=bot_y+dy;
			const overlap=435-new_bottom;
			if (new_bottom<435) dy+=overlap;
		}
	
		//проверяем движение чата вниз
		if (dy>0){
			const new_top=top_y+dy;
			if (new_top>50)
				return;
		}
		
		objects.chat_msg_cont.y+=dy;
		
	},
		
	wheel_event(delta) {
		
		objects.chat_msg_cont.y-=delta*50;	
		const chat_bottom = this.last_record_end;
		const chat_top = this.last_record_end - objects.chat_records.filter(obj => obj.visible === true).length*70;
		
		if (objects.chat_msg_cont.y+chat_bottom<430)
			objects.chat_msg_cont.y = 430-chat_bottom;
		
		if (objects.chat_msg_cont.y+chat_top>0)
			objects.chat_msg_cont.y=-chat_top;
		
	},
		
	async write_btn_down(){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		
		//оплата разблокировки чата
		if (my_data.blocked){	
		
			let block_num=await fbs_once('players/'+my_data.uid+'/block_num');
			block_num=block_num||1;
			block_num=Math.min(6,block_num);
		
			if(game_platform==='YANDEX'){
				
				this.payments.purchase({ id: 'unblock'+block_num}).then(purchase => {
					this.unblock_chat();
				}).catch(err => {
					message.add('Ошибка при покупке!');
				})				
			}
			
			if (game_platform==='VK') {
				
				vkBridge.send('VKWebAppShowOrderBox', { type: 'item', item: 'unblock'+block_num}).then(data =>{
					this.unblock_chat();
				}).catch((err) => {
					message.add('Ошибка при покупке!');
				});			
			
			};			
				
			return;
		}
		
		
		sound.play('click');
		
		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);
				
		if (this.recent_msg.length>3){
			message.add('Подождите 1 минуту')
			return;
		}		
		
		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());
		
		//пишем сообщение в чат и отправляем его		
		const msg = await keyboard.read(70);		
		if (msg)			
			my_ws.safe_send({cmd:'push',path:'chat',val:{uid:my_data.uid,name:my_data.name,msg,tm:'TMS'}});
		
		
	},
	
	unblock_chat(){
		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		objects.chat_enter_button.texture=assets.chat_enter_img;	
		fbs.ref('blocked/'+my_data.uid).remove();
		my_data.blocked=0;
		message.add('Вы разблокировали чат');
		sound.play('mini_dialog');	
	},
		
	close() {
		
		anim2.add(objects.chat_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		if (objects.chat_keyboard_cont.visible)
			keyboard.close();
	}
		
}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	last_update:0,

	show() {

		objects.desktop.texture=assets.lb_bcg;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.5,'linear');
		
		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 0.5,'easeOutCubic');
				
		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}

		if (Date.now()-this.last_update>120000){
			this.update();
			this.last_update=Date.now();
		}


	},

	close() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;

	},

	back_btn_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};


		sound.play('click');
		this.close();
		main_menu.activate();

	},

	async update() {

		let leaders=await fbs.ref('players').orderByChild('rating').limitToLast(20).once('value');
		leaders=leaders.val();

		const top={
			0:{t_name:objects.lb_1_name,t_rating:objects.lb_1_rating,avatar:objects.lb_1_avatar},
			1:{t_name:objects.lb_2_name,t_rating:objects.lb_2_rating,avatar:objects.lb_2_avatar},
			2:{t_name:objects.lb_3_name,t_rating:objects.lb_3_rating,avatar:objects.lb_3_avatar},			
		}
		
		for (let i=0;i<7;i++){	
			top[i+3]={};
			top[i+3].t_name=objects.lb_cards[i].name;
			top[i+3].t_rating=objects.lb_cards[i].rating;
			top[i+3].avatar=objects.lb_cards[i].avatar;
		}		
		
		//создаем сортированный массив лидеров
		const leaders_array=[];
		Object.keys(leaders).forEach(uid => {
			
			const leader_data=leaders[uid];
			const leader_params={uid,name:leader_data.name, rating:leader_data.rating, pic_url:leader_data.pic_url};
			leaders_array.push(leader_params);
			
			//добавляем в кэш
			players_cache.update(uid,leader_params);			
		});
		
		//сортируем....
		leaders_array.sort(function(a,b) {return b.rating - a.rating});
				
		//заполняем имя и рейтинг
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			target.t_name.set2(leader.name,place>2?190:130);
			target.t_rating.text=leader.rating;			
		}
		
		//заполняем аватар
		for (let place in top){			
			const target=top[place];
			const leader=leaders_array[place];
			await players_cache.update_avatar(leader.uid);			
			target.avatar.texture=players_cache.players[leader.uid].texture;		
		}
	
	}


}

lobby={
	
	state_tint :{},
	_opp_data : {},
	activated:false,
	rejected_invites:{},
	fb_cache:{},
	first_run:0,
	bot_on:1,
	on:0,
	global_players:{},
		
	activate(room,bot_on) {
		
		//первый запуск лобби
		if (!this.activated){			
			//расставляем по соответствующим координатам
			
			for(let i=0;i<objects.mini_cards.length;i++) {

				const iy=i%4;
				objects.mini_cards[i].y=46+iy*83;
			
				let ix;
				if (i>15) {
					ix=~~((i-16)/4)
					objects.mini_cards[i].x=815+ix*190;
				}else{
					ix=~~((i)/4)
					objects.mini_cards[i].x=15+ix*190;
				}
			}		

			this.activated=true;
		}
		
		objects.desktop.texture=assets.lobby_bcg;
		anim2.add(objects.cards_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy]}, true, 0.1,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy]}, true, 0.1,'linear');
		objects.cards_cont.x=0;
		this.on=1;
		
		//отключаем все карточки
		for(let i=0;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false;
				
		//процессинг
		some_process.lobby=function(){lobby.process()};

		//добавляем карточку бота если надо
		if (bot_on!==undefined) this.bot_on=bot_on;
		this.starting_card=0;
		if (this.bot_on){
			this.starting_card=1;
			this.add_card_ai();			
		}
		
		
		//убираем старое и подписываемся на новую комнату
		if (room){			
			if(room_name){
				fbs.ref(room_name).off('value');
				fbs.ref(room_name+'/'+my_data.uid).remove();
			}
			room_name=room;	
		}
				
		fbs.ref(room_name).on('child_changed', snapshot => {	
			const val=snapshot.val()
			//console.log('child_changed',snapshot.key,val,JSON.stringify(val).length)
			this.global_players[snapshot.key]=val;
			lobby.players_list_updated(this.global_players);
		});
		fbs.ref(room_name).on('child_added', snapshot => {			
			const val=snapshot.val()
			//console.log('child_added',snapshot.key,val,JSON.stringify(val).length)
			this.global_players[snapshot.key]=val;
			lobby.players_list_updated(this.global_players);
		});
		fbs.ref(room_name).on('child_removed', snapshot => {			
			const val=snapshot.val()
			//console.log('child_removed',snapshot.key,val,JSON.stringify(val).length)
			delete this.global_players[snapshot.key];
			lobby.players_list_updated(this.global_players);
		});
		

		fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();		
		
		set_state({state : 'o'});
		
		//создаем заголовки
		const room_desc=['КОМНАТА #1','ROOM #1'][LANG];
		objects.t_room_name.text=room_desc;				

	},
	
	change_room(new_room){
				
		//создаем заголовки
		const room_desc='КОМНАТА #'+new_room.slice(6);
		objects.t_room_name.text=room_desc;
		
		//отписываемся от изменений текущей комнаты
		fbs.ref(room_name).off('value');
		
		//анимации разные
		anim2.add(objects.cards_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy]}, true, 0.1,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy]}, true, 0.1,'linear');
		objects.cards_cont.x=0;
		
		//отключаем все карточки
		objects.mini_cards.forEach(c=>c.visible=false);
		
		room_name=new_room;
		
		set_state ({state : 'o'});
		
		//бота нету
		this.bot_on=0;
		
		//подписываемся на изменения состояний пользователей
		fbs.ref(room_name).on('value', snapshot => {lobby.players_list_updated(snapshot.val());});
		
	},
		
	pref_btn_down(){
		
		//если какая-то анимация
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		
		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_pref_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_pref_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	
		
		//убираем контейнер
		anim2.add(objects.cards_cont,{x:[objects.cards_cont.x,800]}, false, 0.2,'linear');
		anim2.add(objects.pref_cont,{x:[-800,objects.pref_cont.sx]}, true, 0.2,'linear');
		
		//меняем футер
		anim2.add(objects.lobby_footer_cont,{y:[objects.lobby_footer_cont.y,450]}, false, 0.2,'linear');
		anim2.add(objects.pref_footer_cont,{y:[450,objects.pref_footer_cont.sy]}, true, 0.2,'linear');
		pref.activate();
		
	},

	players_list_updated(players) {

		//если мы в игре то пока не обновляем карточки
		if (state==='p'||state==='b')
			return;				

		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};
		
		//удаляем инвалидных игроков
		for (let uid in players){	
			if(!players[uid].name||!players[uid].rating||!players[uid].state)
				delete players[uid];
		}

		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков и обновляем кэш
		for (let uid in players){	

			const player=players[uid];

			//обновляем кэш с первыми данными			
			players_cache.update(uid,{name:player.name,rating:player.rating,hidden:player.hidden});
			
			const country =auth2.get_country_from_name(player.name);
			if (country)		
				player.name=player.name.slice(0, -4);
			
			if (player.state!=='p'&&!player.hidden)
				single[uid] = player.name;						
		}
		
		//console.table(single);
		
		//оставляем только тех кто за столом
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			const small_opp_id = p_data[uid].opp_id;			
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
		for (let uid in p_data) {
			const opp_id = p_data[uid].opp_id;		
			if (p_data[opp_id]) {				
				if (uid === p_data[opp_id].opp_id && !tables[uid]) {					
					tables[uid] = opp_id;					
					delete p_data[opp_id];				
				}				
			}		
		}							
					
		//считаем сколько одиночных игроков и сколько столов
		const num_of_single = Object.keys(single).length;
		const num_of_tables = Object.keys(tables).length;
		const num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > objects.mini_cards.length) {
			const num_of_tables_cut = num_of_tables - (num_of_cards - objects.mini_cards.length);			
			const num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			const t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}
		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				const card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state, rating:players[card_uid].rating, name:players[card_uid].name});
			}
		}
		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=0;i<objects.mini_cards.length;i++) {			
			
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
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {			
		
			if (objects.mini_cards[i].visible && objects.mini_cards[i].type === 'table') {
				
				const uid1 = objects.mini_cards[i].uid1;	
				const uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {					
					const t_uid1 = t;
					const t_uid2 = tables[t];									
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
			this.place_new_card({uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем НОВЫЕ столы где свободно
		for (let uid in tables) {			
			const name1=players[uid].name
			const name2=players[tables[uid]].name
			
			const rating1= players[uid].rating
			const rating2= players[tables[uid]].rating
			
			const game_id=players[uid].game_id;
			this.place_table({uid1:uid,uid2:tables[uid],name1, name2, rating1, rating2,game_id});
		}
		
	},

	add_card_ai() {
		
		const card=objects.mini_cards[0]
		
		//убираем элементы стола так как они не нужны
		card.rating_text1.visible = false;
		card.rating_text2.visible = false;
		card.avatar1.visible = false;
		card.avatar2.visible = false;
		card.avatar1_frame.visible = false;
		card.avatar2_frame.visible = false;
		card.table_rating_hl.visible = false;
		card.bcg.texture=assets.mini_player_card_ai;

		card.visible=true;
		card.uid='bot';
		card.name=card.name_text.text='Бот';

		card.rating=1400;		
		card.rating_text.text = card.rating;
		card.avatar.set_texture(assets.pc_icon);
		
		//также сразу включаем его в кэш
		if(!players_cache.players.bot){
			players_cache.players.bot={};
			players_cache.players.bot.name='Бот';
			players_cache.players.bot.rating=1400;
			players_cache.players.bot.texture=assets.pc_icon;			
		}
	},
	
	get_state_texture(s,uid) {
		
		switch(s) {

			case 'o':
				return assets.mini_player_card;
			break;

			case 'b':
				return assets.mini_player_card_bot;
			break;

			case 'p':
				return assets.mini_player_card;
			break;
			
			case 'b':
				return assets.mini_player_card;
			break;

		}
	},
	
	place_table(params={uid1:0,uid2:0,name1: 'X',name2:'X', rating1: 1400, rating2: 1400,game_id:0}) {
				
				
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {
			
			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state);
				card.state=params.state;

				card.type = "table";				
				
				card.bcg.texture = assets.mini_player_card_table;
				
				//присваиваем карточке данные
				//card.uid=params.uid;
				card.uid1=params.uid1;
				card.uid2=params.uid2;
												
				//убираем элементы свободного стола
				card.rating_text.visible = false;
				card.avatar.visible = false;
				card.avatar_frame.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.name_text.visible = false;
				card.t_country.visible = false;

				//Включаем элементы стола 
				card.table_rating_hl.visible=true;
				card.rating_text1.visible = true;
				card.rating_text2.visible = true;
				card.avatar1.visible = true;
				card.avatar2.visible = true;
				card.avatar1_frame.visible = true;
				card.avatar2_frame.visible = true;
				//card.rating_bcg.visible = true;

				card.rating_text1.text = params.rating1;
				card.rating_text2.text = params.rating2;
				
				card.name1 = params.name1;
				card.name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:card.avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:card.avatar2});


				card.visible=true;
				card.game_id=params.game_id;

				break;
			}
		}
		
	},

	update_existing_card(params={id:0, state:'o' , rating:1400, name:''}) {

		//устанавливаем цвет карточки в зависимости от состояния( аватар не поменялись)
		const card=objects.mini_cards[params.id];
		card.bcg.texture=this.get_state_texture(params.state,card.uid);
		card.state=params.state;

		card.name_text.set2(params.name,105);
		card.rating=params.rating;
		card.rating_text.text=params.rating;
		card.visible=true;
	},

	place_new_card(params={uid:0, state: 'o', name:'X ', rating: rating}) {

		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			//ссылка на карточку
			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state,params.uid);
				card.state=params.state;

				card.type = 'single';
				
				//присваиваем карточке данные
				card.uid=params.uid;

				//убираем элементы стола так как они не нужны
				card.rating_text1.visible = false;
				card.rating_text2.visible = false;
				card.avatar1.visible = false;
				card.avatar2.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.table_rating_hl.visible=false;
				
				//включаем элементы одиночной карточки
				card.rating_text.visible = true;
				card.avatar.visible = true;
				card.avatar_frame.visible = true;
				card.name_text.visible = true;
				card.t_country.visible = true;


				//добавляем страну и имя из кэша
				const cached_player=players_cache.players[params.uid];
				card.t_country.text = cached_player.country||'';;
				card.name=params.name;
				card.name_text.set2(params.name,105);
				card.rating=params.rating;
				card.rating_text.text=params.rating;

				card.visible=true;
				

				//стираем старые данные
				card.avatar.set_texture();

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:card.avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				return;
			}
		}

	},

	async load_avatar2 (params={}) {		
		
		//обновляем или загружаем аватарку
		await players_cache.update_avatar(params.uid);
		
		//устанавливаем если это еще та же карточка
		params.tar_obj.set_texture(players_cache.players[params.uid].texture);			
	},

	card_down(card_id) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog(card_id) {
					
		
		//если какая-то анимация или открыт диалог
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();
		
		anim2.add(objects.td_cont,{x:[800, objects.td_cont.sx]}, true, 0.1,'linear');
		
		const card=objects.mini_cards[card_id];
		
		objects.td_cont.card=card;
		
		objects.td_avatar1.set_texture(players_cache.players[card.uid1].texture);
		objects.td_avatar2.set_texture(players_cache.players[card.uid2].texture);
		
		objects.td_rating1.text = card.rating_text1.text;
		objects.td_rating2.text = card.rating_text2.text;
		
		objects.td_name1.set2(card.name1, 240);
		objects.td_name2.set2(card.name2, 240);
		
	},
	
	close_table_dialog() {
		sound.play('close_it');
		anim2.add(objects.td_cont,{x:[objects.td_cont.x, 800]}, false, 0.1,'linear');
	},

	show_invite_dialog(card_id) {

		//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');			
		
		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=assets.invite_button;
	
		anim2.add(objects.invite_cont,{x:[800, objects.invite_cont.sx]}, true, 0.15,'linear');
		
		const card=objects.mini_cards[card_id];
		
		//копируем предварительные данные
		lobby._opp_data = {uid:card.uid,name:card.name,rating:card.rating};
			
		
		this.show_feedbacks(lobby._opp_data.uid);
		

		let invite_available=lobby._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (card.state==="o" || card.state==="b");
		invite_available=invite_available || lobby._opp_data.uid==='bot';
		
		//на моей карточке показываем стастику
		if(lobby._opp_data.uid===my_data.uid){
			objects.invite_my_stat.text=`Рейтинг: ${my_data.rating}\nИгры: ${my_data.games}`;
			objects.invite_my_stat.visible=true;
		}else{
			objects.invite_my_stat.visible=false;
		}
		
		//кнопка удаления комментариев
		objects.fb_delete_button.visible=my_data.uid===lobby._opp_data.uid;
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=invite_available;

		//заполняем карточу приглашения данными		
		objects.invite_avatar.set_texture(players_cache.players[card.uid].texture);
		objects.invite_name.set2(lobby._opp_data.name,230);
		objects.invite_rating.text=card.rating_text.text;
				
	},
	
	fb_delete_down(){
		
		objects.fb_delete_button.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:['*** empty ***',999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);
		
		message.add(['Отзывы удалены','Removed!'][LANG])
		
	},
	
	async show_invite_dialog_from_chat(uid,name) {

		//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');			
		
		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=assets.invite_button;
	
		anim2.add(objects.invite_cont,{x:[800, objects.invite_cont.sx]}, true, 0.15,'linear');
		
		let player_data={uid};
		//await this.update_players_cache_data(uid);
					
		//копируем предварительные данные
		lobby._opp_data = {uid,name:players_cache.players[uid].name,rating:players_cache.players[uid].rating};
											
		//на моей карточке показываем стастику
		if(lobby._opp_data.uid===my_data.uid){
			objects.invite_my_stat.text=`Рейтинг: ${my_data.rating}\nИгры: ${my_data.games}`;
			objects.invite_my_stat.visible=true;
		}else{
			objects.invite_my_stat.visible=false;
		}

				
		//фидбэки												
		this.show_feedbacks(lobby._opp_data.uid);
		
		//кнопка удаления комментариев
		objects.fb_delete_button.visible=false;
		
		let invite_available = 	lobby._opp_data.uid !== my_data.uid;
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.set_texture(players_cache.players[uid].texture);
		objects.invite_name.set2(players_cache.players[uid].name,230);
		objects.invite_rating.text=players_cache.players[uid].rating;
	},

	async show_feedbacks(uid) {	


			
		//получаем фидбэки сначала из кэша, если их там нет или они слишком старые то загружаем из фб
		let fb_obj;		
		if (!this.fb_cache[uid] || (Date.now()-this.fb_cache[uid].tm)>120000) {
			let _fb = await fbs.ref("fb/" + uid).once('value');
			fb_obj =_fb.val();	
			
			//сохраняем в кэше отзывов
			this.fb_cache[uid]={};			
			this.fb_cache[uid].tm=Date.now();					
			if (fb_obj){
				this.fb_cache[uid].fb_obj=fb_obj;				
			}else{
				fb_obj={0:['***нет отзывов***',999,' ']};
				this.fb_cache[uid].fb_obj=fb_obj;				
			}

			//console.log('загрузили фидбэки в кэш')				
			
		} else {
			fb_obj =this.fb_cache[uid].fb_obj;	
			//console.log('фидбэки из кэша ,ура')
		}

		
		
		var fb = Object.keys(fb_obj).map((key) => [fb_obj[key][0],fb_obj[key][1],fb_obj[key][2]]);
		
		//сортируем отзывы по дате
		fb.sort(function(a,b) {
			return b[1]-a[1]
		});	
	
		
		//сначала убираем все фидбэки
		objects.feedback_records.forEach(fb=>fb.visible=false)

		let prv_fb_bottom=0;
		const fb_cnt=Math.min(fb.length,objects.feedback_records.length);
		for (let i = 0 ; i < fb_cnt;i++) {
			const fb_place=objects.feedback_records[i];
			
			let sender_name =  fb[i][2] || 'Неизв.';
			if (sender_name.length > 10) sender_name = sender_name.substring(0, 10);		
			fb_place.set(sender_name,fb[i][0]);
			
			
			const fb_height=fb_place.text.textHeight*0.85;
			const fb_end=prv_fb_bottom+fb_height;
			
			//если отзыв будет выходить за экран то больше ничего не отображаем
			const fb_end_abs=fb_end+objects.invite_cont.y+objects.invite_feedback.y;
			if (fb_end_abs>450) return;
			
			fb_place.visible=true;
			fb_place.y=prv_fb_bottom;
			prv_fb_bottom+=fb_height;
		}
	
	},

	async close() {

		if (objects.invite_cont.visible)
			this.close_invite_dialog();
		
		if (objects.td_cont.visible)
			this.close_table_dialog();
		
		some_process.lobby=function(){};
		
		if (objects.pref_cont.visible)
			pref.close();

		//плавно все убираем
		anim2.add(objects.cards_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[ objects.lobby_footer_cont.y,450]}, false, 0.2,'linear');
		anim2.add(objects.lobby_header_cont,{y:[objects.lobby_header_cont.y,-50]}, false, 0.2,'linear');
		
		this.on=0;
		
		//больше ни ждем ответ ни от кого
		pending_player="";
		
		//отписываемся от изменений состояний пользователей
		fbs.ref(room_name).off();

	},
	
	async inst_message(data){
		
		//когда ничего не видно не принимаем сообщения
		if(!objects.cards_cont.visible) return;		

		await players_cache.update(data.uid);
		await players_cache.update_avatar(data.uid);		
		
		sound.play('inst_msg');		
		anim2.add(objects.inst_msg_cont,{alpha:[0, 1]},true,0.4,'linear',false);		
		objects.inst_msg_avatar.texture=players_cache.players[data.uid].texture||PIXI.Texture.WHITE;
		objects.inst_msg_text.set2(data.msg,290);
		objects.inst_msg_cont.tm=Date.now();
	},
	
	get_room_index_from_rating(){		
		//номер комнаты в зависимости от рейтинга игрока
		const rooms_bins=[0,1366,1437,1580,9999];
		let room_to_go='state1';
		for (let i=1;i<rooms_bins.length;i++){
			const f=rooms_bins[i-1];
			const t=rooms_bins[i];		
			if (my_data.rating>f&&my_data.rating<=t)
				return i;
		}				
		return 1;
		
	},
	
	process(){
		
		const tm=Date.now();
		if (objects.inst_msg_cont.visible&&objects.inst_msg_cont.ready)
			if (tm>objects.inst_msg_cont.tm+7000)
				anim2.add(objects.inst_msg_cont,{alpha:[1, 0]},false,0.4,'linear');

	},
	
	peek_down(){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		this.close();	
		
		//активируем просмотр игры
		game_watching.activate(objects.td_cont.card);
	},
	
	async switch_header(){
		
		await anim2.add(objects.lobby_header,{y:[objects.lobby_header.sy, -60],alpha:[1,0]},false,1,'linear',false);	
		objects.lobby_header.text=this.sw_header.header_list[this.sw_header.index];		
		anim2.add(objects.lobby_header,{y:[-60,objects.lobby_header.sy],alpha:[0,1]},true,1,'linear',false);	
		
	},
	
	wheel_event(dir) {
		
	},
	
	async fb_my_down() {
		
		
		if (this._opp_data.uid !== my_data.uid || objects.feedback_cont.visible === true)
			return;
		
		let fb = await feedback.show(this._opp_data.uid);
		
		//перезагружаем отзывы если добавили один
		if (fb[0] === 'sent') {
			let fb_id = irnd(0,50);			
			await fbs.ref("fb/"+this._opp_data.uid+"/"+fb_id).set([fb[1], firebase.database.ServerValue.TIMESTAMP, my_data.name]);
			this.show_feedbacks(this._opp_data.uid);			
		}
		
	},

	close_invite_dialog() {

		sound.play('close_it');	

		if (!objects.invite_cont.visible) return;		

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim2.add(objects.invite_cont,{x:[objects.invite_cont.x, 800]}, false, 0.15,'linear');
	},

	async send_invite() {

		if (!objects.invite_cont.ready||!objects.invite_cont.visible||objects.invite_button.texture===assets.invite_wait_img){
			sound.play('locked');
			return
		};

		if (anim2.any_on()){
			sound.play('locked');
			return
		};
		
		if (lobby._opp_data.uid==='bot'){
			await this.close();	
			game.activate('master', bot_player );
		} else {
			sound.play('click');
			objects.invite_button.texture=assets.invite_wait_img;			
			fbs.ref(`inbox/${lobby._opp_data.uid}`).set({sender:my_data.uid,message:'INV',tm:Date.now()});
			pending_player=lobby._opp_data.uid;

		}

	},

	rejected_invite(msg) {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		lobby._opp_data={};
		this.close_invite_dialog();
		if(msg==='REJECT_ALL')
			big_message.show('Соперник пока не принимает приглашения.','---','');
		else
			big_message.show('Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','---','');
	},

	async accepted_invite(seed) {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=lobby._opp_data;
		
		//сразу карточку оппонента
		objects.opp_card_name.set2(opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=players_cache.players[opp_data.uid].texture;		

		//закрываем меню и начинаем игру
		await lobby.close();
		game.activate('master',online_game);
		
	},

	chat_btn_down(){
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		
		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_chat_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_chat_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	
		
		this.close();
		chat.activate();
		
	},

	async lb_btn_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_lb_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_lb_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	


		await this.close();
		lb.show();
	},
	
	list_btn_down(dir){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		const cur_x=objects.cards_cont.x;
		const new_x=cur_x-dir*800;
		
		
		//подсветка
		const tar_btn={'-1':objects.lobby_left_btn,'1':objects.lobby_right_btn}[dir];
		objects.lobby_btn_hl.x=tar_btn.x;
		objects.lobby_btn_hl.y=tar_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	
		
		
		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}
		
		anim2.add(objects.cards_cont,{x:[cur_x, new_x]},true,0.2,'easeInOutCubic');
	},

	async back_btn_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

	},
	
	info_btn_down(){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		
		if(!objects.info_cont.init){
			
			objects.info_records[0].set({uid:'bot',name:'Админ',msg:'Новое правило - рейтинг игроков, неактивных более 5 дней, будет снижен до 2000.',tm:1734959027520})
			objects.info_records[0].scale_xy=1.2;
			objects.info_records[0].y=145;
			
			objects.info_records[1].set({uid:'bot',name:'Админ',msg:'Новое правило - не авторизованным игрокам не доступен рейтинг более 2000.',tm:1734959227520})
			objects.info_records[1].scale_xy=1.2;
			objects.info_records[1].y=235;
			
			objects.info_cont.init=1;
		}
		
		anim2.add(objects.info_cont,{alpha:[0,1]}, true, 0.25,'linear');

	},
	
	info_close_down(){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('close_it');
		
		anim2.add(objects.info_cont,{alpha:[1,0]}, false, 0.25,'linear');
		
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
			let resp1 = await fetch("https://ipinfo.io/json?token=63f43de65702b8");
			let resp2 = await resp1.json();			
			country_code = resp2.country || '';			
		} catch(e){
			return country_code
		}
		return country_code;		
	},
	
	async get_country_code2() {
		let country_code = ''
		try {
			let resp1 = await fetch("https://ipapi.co/json");
			let resp2 = await resp1.json();			
			country_code = resp2.country_code || '';			
		} catch(e){
			return country_code
		}
		return country_code;		
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
		
	async init() {	
				
		if (game_platform === 'YANDEX') {			
		
			try {await this.load_script('https://yandex.ru/games/sdk/v2')} catch (e) {alert(e)};										
					
			let _player;
			
			try {
				window.ysdk = await YaGames.init({});			
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};
			
			my_data.uid = _player.getUniqueID().replace(/[\/+=]/g, '');
			my_data.name = _player.getName();
			my_data.orig_pic_url = _player.getPhoto('medium');
			
			if (my_data.orig_pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
				my_data.orig_pic_url = 'mavatar'+my_data.uid;	
			
			if (my_data.name === '')
				my_data.name = this.get_random_name(my_data.uid);
				
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
			my_data.orig_pic_url = _player.photo_100;
			
			return;
			
		}
		
		if (game_platform === 'GOOGLE_PLAY') {	

			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('GP_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;		
			return;
		}
		
		if (game_platform === 'DEBUG') {		

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;			
			return;
		}
		
		if (game_platform === 'CRAZYGAMES') {			
			
			try {await this.load_script('https://sdk.crazygames.com/crazygames-sdk-v2.js')} catch (e) {alert(e)};	
			try {await this.load_script('https://akukamil.github.io/quoridor/jwt-decode.js')} catch (e) {alert(e)};		
			const cg_user_data=await this.search_in_crazygames();			
			my_data.uid = cg_user_data.userId || this.search_in_local_storage() || this.get_random_uid_for_local('CG_');
			my_data.name = cg_user_data.username || this.get_random_name(my_data.uid);
			my_data.orig_pic_url = cg_user_data.profilePictureUrl || ('mavatar'+my_data.uid);	
					

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
			my_data.orig_pic_url = 'mavatar'+my_data.uid;		
		}
	},
	   
	get_country_from_name(name){
		
		const have_country_code=/\(.{2}\)/.test(name);
		if(have_country_code)
			return name.slice(-3, -1);
		return '';
		
	}

}

function resize() {
    const vpw = document.body.clientWidth;  // Width of the viewport
    const vph = document.body.clientHeight; // Height of the viewport
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

	if (document.hidden === true) {
		hidden_state_start = Date.now();
		PIXI.sound.volumeAll=0;	
	} else {
		PIXI.sound.volumeAll=1;	
	}	
	
	set_state({hidden : document.hidden});	
}

async function load_resources() {

	document.getElementById("m_progress").style.display = 'flex';

	//подпапка с ресурсами
	let lang_pack = ['RUS','ENG'][LANG];

	git_src='https://akukamil.github.io/quoridor/'
	//git_src=''


	const loader=new PIXI.Loader();
	loader.add("m2_font", git_src+"/fonts/Bahnschrift/font.fnt");

	loader.add('click',git_src+'/sounds/click.mp3');
	loader.add('locked',git_src+'/sounds/locked.mp3');
	loader.add('clock',git_src+'/sounds/clock.mp3');
	loader.add('close_it',git_src+'/sounds/close_it.mp3');
	loader.add('game_start',git_src+'/sounds/game_start.mp3');
	loader.add('lose',git_src+'/sounds/lose.mp3');
	loader.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
	loader.add('block_wall',git_src+'/sounds/block_wall.mp3');
	loader.add('iter_wall',git_src+'/sounds/iter_wall.mp3');
	loader.add('bad_move',git_src+'/sounds/bad_move.mp3');
	loader.add('win',git_src+'/sounds/win.mp3');
	loader.add('invite',git_src+'/sounds/invite.mp3');
	loader.add('cancel_wall',git_src+'/sounds/cancel_wall.mp3');
	loader.add('place_wall',git_src+'/sounds/place_wall.mp3');
	loader.add('checker_tap',git_src+'/sounds/checker_tap.mp3');
	loader.add('keypress',git_src+'sounds/keypress.mp3');
	loader.add('note',git_src+'sounds/note.mp3');
	
	loader.add('multiavatar', 'https://akukamil.github.io/common/multiavatar.min.txt');	
	
	//добавляем текстуры стикеров
	for (let i=0;i<16;i++)
		loader.add("sticker_texture_"+i, git_src+"/stickers/"+i+".png");
	
    //добавляем из листа загрузки
    for (let i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            loader.add(load_list[i].name, git_src+'res/'+lang_pack+'/'+load_list[i].name+"."+load_list[i].image_format);		


	loader.onProgress.add(progress);
	function progress(l, resource) {
		document.getElementById("m_bar").style.width =  Math.round(l.progress)+"%";
	}	
	
	await new Promise((resolve, reject)=> loader.load(resolve))
	
	//переносим все в ассеты
	await new Promise(res=>loader.load(res))
	for (const res_name in loader.resources){
		const res=loader.resources[res_name];			
		assets[res_name]=res.texture||res.sound||res.data;			
	}	
	
	
	//добавялем библиотеку аватаров
	const script = document.createElement('script');
	script.textContent = assets.multiavatar;
	document.head.appendChild(script);
	
	//убираем элементы загрузки
	document.getElementById("m_progress").outerHTML = "";	

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
		
		//короткое обращение
		fbs=firebase.database();
	}
	
	//создаем приложение пикси и добавляем тень
	app.stage = new PIXI.Container();
	app.renderer = new PIXI.Renderer({width:M_WIDTH, height:M_HEIGHT,antialias:true});
	document.body.appendChild(app.renderer.view).style["boxShadow"] = "0 0 15px #000000";
	document.body.style.backgroundColor = 'rgb(141,211,200)';

	//доп функция для текста битмап
	PIXI.BitmapText.prototype.set2=function(text,w){		
		const t=this.text=text;
		for (i=t.length;i>=0;i--){
			this.text=t.substring(0,i)
			if (this.width<w) return;
		}	
	}

	//доп функция для применения текстуры к графу
	PIXI.Graphics.prototype.set_texture=function(texture){		
	
		if(!texture) return;

		// Calculate the scale to fit the texture to the circle's size
		const scaleX = this.w / texture.width;
		const scaleY = this.h / texture.height;

		// Create a new matrix for the texture
		const matrix = new PIXI.Matrix();

		// Scale and translate the matrix to fit the circle
		matrix.scale(scaleX, scaleY);
		const radius=this.w*0.5;
		this.clear();
		this.beginTextureFill({texture,matrix});		
		this.drawCircle(radius, radius, radius);		
		this.endFill();	
	}
	

	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(assets[obj_name]);
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
	
	
	//анимация лупы
	some_process.loup_anim=function() {
		objects.id_loup.x=20*Math.sin(game_tick*8)+90;
		objects.id_loup.y=20*Math.cos(game_tick*8)+110;
	}

	//запускаем главный цикл
	main_loop();

	//показыаем основное меню
	main_menu.activate();
	console.clear()
	
	//получаем данные об игроке из социальных сетей
	await auth2.init();		
		
	//получаем остальные данные об игроке
	let snapshot = await firebase.database().ref("players/"+my_data.uid).once('value');
	let other_data = snapshot.val();
		
	//делаем защиту от неопределенности
	my_data.rating = (other_data?.rating) || 1400;	
	my_data.games = (other_data?.games) || 0;
	my_data.name=other_data?.name || my_data.name;
	my_data.chip = (other_data?.chip) || 0;
	my_data.nick_tm = other_data?.nick_tm || 0;
	my_data.avatar_tm = other_data?.avatar_tm || 0;
	my_data.country = other_data?.country || await auth2.get_country_code() || await auth2.get_country_code2() 
	
	room_name='states';
	
	//правильно определяем аватарку
	if (other_data?.pic_url && other_data.pic_url.includes('mavatar'))
		my_data.pic_url=other_data.pic_url
	else
		my_data.pic_url=my_data.orig_pic_url
	
	//добавляем страну к имени если ее нет
	if (!auth2.get_country_from_name(my_data.name)&&my_data.country)
		my_data.name=`${my_data.name} (${my_data.country})`
	
	//загружаем мои данные в кэш
	await players_cache.update(my_data.uid,{pic_url:my_data.pic_url,country:my_data.country,name:my_data.name,rating:my_data.rating});
	await players_cache.update_avatar(my_data.uid);
	
	//устанавливаем фотки в попап
	objects.my_avatar.texture=players_cache.players[my_data.uid].texture;
	objects.id_avatar.texture=players_cache.players[my_data.uid].texture;
	objects.id_name.set2(my_data.name,150);		
		
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
	firebase.database().ref('players/'+my_data.uid).set({name:my_data.name,country:my_data.country, pic_url: my_data.pic_url, rating : my_data.rating, chip : my_data.chip,nick_tm:my_data.nick_tm, avatar_tm:my_data.avatar_tm, games : my_data.games, tm:firebase.database.ServerValue.TIMESTAMP});

	//сообщение для дубликатов
	client_id = irnd(10,999999);
	fbs.ref('inbox/'+my_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id});

	//устанавливаем мой статус в онлайн
	set_state({state : 'o'});
	
	//это событие когда меняется видимость приложения
	document.addEventListener("visibilitychange", vis_change);

	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);

	//загрузка сокета
	await auth2.load_script('https://akukamil.github.io/common/my_ws.js');	
	
	//ждем загрузки чата
	chat.init();	

	//ждем и убираем попап
	await new Promise((resolve, reject) => setTimeout(resolve, 500));
	
	anim2.add(objects.id_cont,{y:[objects.id_cont.y, -200]}, false, 1,'easeInBack');
	
	some_process.loup_anim=function() {};

		
	//событие ролика мыши в карточном меню
	window.addEventListener('keydown',function(event){keyboard.keydown(event.key)});	
	window.addEventListener('wheel', (event) => {chat.wheel_event(Math.sign(event.deltaY))}, {passive: false});	
		
	//контроль за присутсвием
	var connected_control = firebase.database().ref('.info/connected');
	connected_control.on("value", (snap) => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});



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
	
	if (s.includes('127.0')) {
			
		game_platform = 'DEBUG';	
		LANG = await language_dialog.show();
		return;	
	}	
	
	game_platform = 'UNKNOWN';	
	LANG = await language_dialog.show();
	
	

}

function main_loop() {


	game_tick+=0.016666666;
	anim2.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();

	
	app.renderer.render(app.stage);	
	requestAnimationFrame(main_loop);
}