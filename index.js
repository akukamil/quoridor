const M_WIDTH=800, M_HEIGHT=450;
let app ={stage:{},renderer:{}}, assets={},ROOM_NAME='states1', game,SERVER_TM=0, gdata={}, objects={}, state='',my_role='',LANG = 0, game_tick=0, my_turn=0,game_id=0, h_state=0, made_moves=0,client_id, game_platform="", hidden_state_start = 0, connected = 1, players="", pending_player="",git_src,my_data={opp_id : ''},opp_data={},some_process = {},game_name='quoridor';
const V_WALL = 2, H_WALL = 1, ROW0 = 0, ROW8 = 8, MY_ID = 1, OPP_ID = 2, MAX_MOVES = 50, FIELD_MARGIN_X = 50,FIELD_MARGIN_Y = 30;
const WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;
const COM_URL='https://akukamil.github.io/com'
let TM={s:0,ms:0}

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
		this.name_text=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 22,align: 'center'});
		this.name_text.anchor.set(1,0);
		this.name_text.x=180;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;		

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 30,align: 'center'});
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
		
		
		this.rating_text1=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 24,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=48.1;
		this.rating_text1.y=56;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 24,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150.1;
		this.rating_text2.y=56;		
		
		this.t_country=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 25,align: 'center'});
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

		this.bcg=new PIXI.Sprite(assets.lb_player_card_bcg)
		this.bcg.interactive=true
		this.bcg.pointerover=function(){this.tint=0x55ffff}
		this.bcg.pointerout=function(){this.tint=0xffffff}
		this.bcg.width = 370
		this.bcg.height = 70

		this.place=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 25,align: 'center'})
		this.place.tint=0xffffff
		this.place.x=20
		this.place.y=22

		this.avatar=new PIXI.Graphics()
		this.avatar.x=43
		this.avatar.y=13
		this.avatar.w=this.avatar.h=44
		this.avatar.width=this.avatar.height=44

		this.name=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 25,align: 'center'})
		this.name.tint=0xcceeff
		this.name.x=105
		this.name.y=22

		this.rating=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 25,align: 'center'})
		this.rating.x=303
		this.rating.tint=0xFFFF00
		this.rating.y=22

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating)
	}


}

class chat_record_class extends PIXI.Container {

	constructor() {

		super();

		this.tm=0;
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

		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'bahnschrift48',fontSize: 17});
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

		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'bahnschrift48',fontSize: 19,lineSpacing:45,align: 'left'});
		this.msg.x=this.avatar.x+75;
		this.msg.y=this.avatar.y+30;
		this.msg.maxWidth=450;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0xffffff;

		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'bahnschrift48',fontSize: 15});
		this.msg_tm.tint=0x999999;
		this.msg_tm.anchor.set(1,0);

		this.visible = false;
		this.addChild(this.msg_bcg,this.gif_bcg,this.gif,this.avatar_bcg,this.avatar,this.avatar_frame,this.name,this.msg,this.msg_tm);

	}

	nameToColor(name) {
		  // Create a hash from the name
		  let hash = hf.hash(name)

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

	update_avatar(uid, tar_sprite) {

		//определяем pic_url
		const pdata=players_cache.get_pdata(uid)
		if(pdata)
			tar_sprite.set_texture(pdata.texture)
		else
			players_cache.update(uid,{source:'chat'})
	}

	async set(msg_data) {

		//получаем pic_url из фб
		this.avatar.set_texture(PIXI.Texture.WHITE);

		if (msg_data.uid==='admin'){
			this.msg_bcg.tint=0x55ff55;
			this.avatar.set_texture(assets.pc_icon);
		}else{
			this.msg_bcg.tint=0xffffff;
			this.update_avatar(msg_data.uid, this.avatar);
		}

		this.uid=msg_data.uid;
		this.tm=msg_data.tm;

		this.name.set2(msg_data.name,150);
		this.name.tint=this.nameToColor(msg_data.name);
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		
		this.visible = true;

		if (msg_data.gif_id){

			const base_t=await gif_sel.load_gif(`${COM_URL}/gifs/${msg_data.gif_id}.mp4`)

			if (!base_t) {
				console.log(`Не получилось загрузить гифку ${msg_data.gif_id}`)
				this.visible=false;
				return 0;
			}

			base_t.resource.source.play()
			base_t.resource.source.loop=true
			
			this.msg.text=''

			this.gif.texture=PIXI.Texture.from(base_t)
			this.gif.visible=true
			const aspect_ratio=base_t.width/base_t.height
			this.gif.height=90
			this.gif.width=this.gif.height*aspect_ratio
			this.msg_bcg.visible=false
			this.msg.visible=false
			this.msg_tm.anchor.set(0,0)
			this.msg_tm.y=this.gif.height+9
			this.msg_tm.x=this.gif.width+102

			this.gif_bcg.visible=true
			this.gif_bcg.height=this.gif.height
			this.gif_bcg.width=	this.gif.width
			return this.gif.height+30

		}else{

			this.gif_bcg.visible=false;
			this.gif.visible=false;
			this.msg_bcg.visible=true;
			this.msg.visible=true;

			this.msg.text=msg_data.msg;
			
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
		this.text=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 19,align: 'left',lineSpacing:38})
		this.text.maxWidth=290
		this.text.tint=0xFFFF00

		this.name_text=new PIXI.BitmapText('', {fontName: 'bahnschrift48',fontSize: 19,align: 'left'})
		this.name_text.tint=0xFFFFFF


		this.addChild(this.text,this.name_text)
	}

	set(fb){		
	
		//метка что отзывов нет
		if (fb.nofb){
			this.text.visible=false
			this.name_text.text='Нет отзывов'
			this.name_text.tint=0x558899
			return
		}
		
		let sender_name = fb.name || 'Неизв.'
		if (sender_name.length > 10) sender_name = sender_name.substring(0, 10)
				
		this.text.visible=true
		this.text.text=sender_name+': '+fb.f
		
		this.name_text.tint=0xFFFFFF
		this.name_text.text=sender_name+':'

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
		anim3.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);		
		
	}
	
}

pmsg={

	promise_resolve :0,

	async add({t='text', timeout=3000,snd='message',online=0}={}) {

		if (this.promise_resolve!==0)
			this.promise_resolve("forced")
			
		//воспроизводим звук
		sound.play(snd);

		objects.pmsg_text.text=t
		const anim_res=await anim3.add(objects.pmsg_cont,{x:[-200,objects.pmsg_cont.sx,'easeOutBack']}, true, 0.25);

		if (anim_res===2) return
		
		const res = await new Promise(res => {
			pmsg.promise_resolve = res;
			setTimeout(res, timeout)
		})

		if (res==="forced") return

		anim3.add(objects.pmsg_cont,{x:[objects.pmsg_cont.sx, -200,'easeInBack']}, false, 0.25);
	},
	
	no_in_chat_down(){
		pmsg.promise_resolve()
		mp_game.no_in_chat_cmd()
	},

	clicked() {
		pmsg.promise_resolve()
	}

}

anim3={

	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0,visible:false,ready:true, alpha:0},

	slots: new Array(50).fill().map(u => ({obj:{},on:0,block:true,params_num:0,p_resolve:0,progress:0,vis_on_end:false,tm:0,params:new Array(10).fill().map(u => ({param:'x',s:0,f:0,d:0,func:this.linear}))})),

	any_on() {

		for (let s of this.slots)
			if (s.on&&s.block)
				return true
		return false;
	},

	wait(seconds){
		return this.add(this.empty_spr,{x:[0,1,'linear']}, false, seconds);
	},

	linear(x) {
		return x
	},

	kill_anim(obj) {

		for (let i=0;i<this.slots.length;i++){
			const slot=this.slots[i];
			if (slot.on&&slot.obj===obj){
				this.finish_slot(slot)
				slot.p_resolve(2)
			}
		}
	},
	
	finish_all_slots(){		
		for (let i=0;i<this.slots.length;i++){
			const slot=this.slots[i];
			if (slot.on){
				this.finish_slot(slot)
				slot.p_resolve(3)
			}
		}
	},

	easeBridge(x){

		if(x<0.1)
			return x*10;
		if(x>0.9)
			return (1-x)*10;
		return 1
	},

	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
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

	easeOutQuart(x){
		return 1 - Math.pow(1 - x, 4);
	},

	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	},

	easeTwiceBlink(x){

		if(x<0.333)
			return 1;
		if(x>0.666)
			return 1;
		return 0
	},

	flick(x){

		return Math.abs(Math.sin(x*6.5*3.141593));

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

	ease2back(x) {
		return Math.sin(x*Math.PI);
	},

	easeInOutCubic(x) {

		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},

	easeInOutBack(x) {

		return x < 0.5
		  ? (Math.pow(2 * x, 2) * ((this.c2 + 1) * 2 * x - this.c2)) / 2
		  : (Math.pow(2 * x - 2, 2) * ((this.c2 + 1) * (x * 2 - 2) + this.c2) + 2) / 2;
	},

	shake(x) {

		return Math.sin(x*2 * Math.PI);


	},

	add (obj, inp_params, vis_on_end, time, block) {

		//если уже идет анимация данного спрайта то отменяем ее
		anim3.kill_anim(obj)
		
		if(document.hidden){
			this.finish_obj(obj,inp_params,vis_on_end)
			return
		}
		

		let found=false;
		//ищем свободный слот для анимации
		for (let i = 0; i < this.slots.length; i++) {

			const slot=this.slots[i];
			if (slot.on) continue;

			found=true;

			obj.visible = true
			obj.ready = false

			//заносим базовые параметры слота
			slot.on=1;
			slot.params_num=Object.keys(inp_params).length;
			slot.obj=obj;
			slot.vis_on_end=vis_on_end;
			slot.block=block===undefined;
			slot.t1=TM.s
			slot.t=time

			//добавляем дельту к параметрам и устанавливаем начальное положение
			let ind=0;
			for (const param in inp_params) {

				const s=inp_params[param][0];
				let f=inp_params[param][1];
				const d=f-s;


				//для возвратных функцие конечное значение равно начальному что в конце правильные значения присвоить
				const func_name=inp_params[param][2];
				const func=anim3[func_name].bind(anim3);
				if (func_name === 'ease2back'||func_name==='shake') f=s;

				slot.params[ind].param=param;
				slot.params[ind].s=s;
				slot.params[ind].f=f;
				slot.params[ind].d=d;
				slot.params[ind].func=func;
				ind++;

				//фиксируем начальное значение параметра
				obj[param]=s;
			}

			return new Promise(resolve=>{
				slot.p_resolve = resolve;
			});
		}

		console.log("Кончились слоты анимации");
		this.finish_obj(obj,inp_params,vis_on_end)



	},
	
	finish_obj(obj,params,vis_on_end){
		
		//сразу записываем конечные параметры объекта
		for (const param in params)
			obj[param]=params[param][1]
		obj.ready=true		
		obj.visible=vis_on_end		
		if(!vis_on_end) obj.alpha=1	
	},
	
	finish_slot(slot){
		
		//заносим конечные параметры
		for (let i=0;i<slot.params_num;i++){
			const param=slot.params[i].param;
			const f=slot.params[i].f;
			slot.obj[param]=f;
		}
		
		slot.on = 0
		slot.obj.ready=true
		slot.obj.visible=slot.vis_on_end;
		if(!slot.vis_on_end) slot.obj.alpha=1;
	},

	process () {

		for (let i = 0; i < this.slots.length; i++) {
			const slot=this.slots[i];
			const obj=slot.obj;
			if (slot.on) {

				const progress=(TM.s-slot.t1)/slot.t

				for (let i=0;i<slot.params_num;i++){

					const param_data=slot.params[i]
					const param=param_data.param
					const s=param_data.s
					const d=param_data.d
					const func=param_data.func
					slot.obj[param]=s+d*func(progress)
				}

				//если анимация завершилась то удаляем слот
				if (progress>=0.999) {
					this.finish_slot(slot)
					slot.p_resolve(1)
				}
			}
		}
	}
}

big_message = {
	
	p_resolve : 0,
		
	show(t1,t2, feedback_on) {
				
		if (t2!==undefined || t2!=="")
			objects.big_msg_text2.text=t2;
		else
			objects.big_msg_text2.text='**********';
		
		objects.feedback_btn.visible = feedback_on;

		objects.big_msg_text.text=t1;
		anim3.add(objects.big_msg_cont,{y:[-180,objects.big_msg_cont.sy,'easeOutBack']}, true, 0.6);		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	async feedback_down() {
		
		if (objects.big_msg_cont.ready===false) {
			sound.play('locked');
			return;			
		}

		const opp_uid=opp_data.uid
		anim3.add(objects.big_msg_cont,{y:[objects.big_msg_cont.sy,450,'easeInBack']}, false, 0.4);	
		
		//пишем отзыв и отправляем его
		const fb = await keyboard.read();
		if (fb.length>0) {			
			my_ws.safe_send({cmd:'push',path:'fb/'+opp_uid,val:{uid:my_data.uid.substring(0,7),name:my_data.name,f:fb,tm:'TMS'}})
		}	
		this.p_resolve('close');
				
	},

	close () {
		
		if (objects.big_msg_cont.ready===false)
			return;

		sound.play('close_it');
		anim3.add(objects.big_msg_cont,{y:[objects.big_msg_cont.sy,450,'easeInBack']}, false, 0.4);		
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
	on:0,
	
	calc_new_rating(old_rating, game_result) {
				
		if (game_result === NOSYNC)	return old_rating;
				
		const Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		const Sa = (game_result + 1) / 2;
		return Math.round(my_data.rating + 16 * (Sa - Ea));
		
	},
	
	async activate(r) {
		
		this.me_conf_play = 0
		this.opp_conf_play = 0
		this.on=1
				
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state:'p'})

		//получаем информацию о фишке соперника
		opp_data.chip=await fbs_once('players/'+opp_data.uid+'/chip')||0		
		
		//показываем кнопки
		objects.chat_btn.visible=true
		objects.send_sticker_btn.visible=true
		objects.giveup_btn.visible=true

		//счетчик времени
		this.prv_tick_time=Date.now();
		this.reset_timer(15);
		
		//отображаем таймер
		objects.timer_cont.visible = true;
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		opp_data.rating=players_cache[opp_data.uid]?.rating||1400
		const lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		fbs.ref('players/'+my_data.uid+'/rating').set(lose_rating);
	
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
	
	giveup_down() {
				
		if (!this.on||objects.big_msg_cont.visible || objects.req_cont.visible) {
			sound.play('bad_move');
			return;			
		}
		
		if (anim3.any_on()){
			sound.play('locked')
			return
		}
		
		//отправляем сопернику что мы сдались
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"GIVEUP",tm:Date.now()});
		game.stop('my_giveup')		
		
	},
	
	async chat_down() {

		if (!this.on||objects.big_msg_cont.visible || objects.req_cont.visible) {
			sound.play('bad_move');
			return;			
		}

		if (my_data.blocked){
			pmsg.add({t:'Вы не можете писать в чат, так как вы находитесь в черном списке',snd:'locked'});
			return;
		}
		
		if (anim3.any_on()){
			sound.play('locked')
			return
		}

		sound.play('click');
		const msg=await keyboard.read();

		if (msg) {
			fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'CHAT',tm:Date.now(),data:msg});		
			pmsg.add({t:['Сообщение отправлено!','message sent!'][LANG],timeout:3000})
		}
	},
	
	chat(data) {

		if (objects.big_msg_cont.visible || objects.req_cont.visible) {
			sound.play('locked');
			return;			
		}

		pmsg.add({t:data,timeout:10000,snd:'online_msg'});

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
		
		this.on=0
		
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
		fbs.ref("tables/"+game_id).set({uid:my_data.uid,fin_flag:1,tm:firebase.database.ServerValue.TIMESTAMP});
						
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
			fbs.ref("players/"+[my_data.uid]+"/games").set(my_data.games);		

			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			fbs.ref("finishes/"+game_id + my_role).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result_str,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			
		}
		
		await big_message.show(result_info, ['Рейтинг','Rating'][LANG]+`: ${old_rating} > ${my_data.rating}`,true)
	
	}

};

bot_player = {
	
	timer : 0,
	me_conf_play : 0,
	opp_conf_play : 0,
	move_time_left : 0,
	search_start_time : 0,
	no_incoming_move : 0,
	on:0,
	sw:0,
	sw_calc_on:0,
	gid:0,
		
	async activate() {		
				
		set_state({state :'b'});
		this.gid=hf.randIntInc(10,999999)
		
		//чип бота
		opp_data.uid='bot'
		opp_data.chip=hf.randIntInc(0,19)		
		
		this.on=1
		
		//показываем кнопку стоп
		objects.stop_bot_btn.visible = true
		objects.stop_bot_btn.pointerdown=function(){game.stop_down()}
		
		
		//Ход вместо таймера...........................
		this.reset_timer();
		objects.timer_cont.visible = true;
		objects.timer_text.text  = ['мой ход','my turn'][LANG];
	},
			
	send_move() {
		
		if (!this.sw){			
			pmsg.add({t:['Не могу ходить!','Can not move!'][LANG],timeout:3000})
			return
		}
		
		this.sw_calc_on=1
		this.sw.postMessage({type:'mm',f:game.field,gid:this.gid})
	},
	
	inc_move(data){
		if (data.gid!==this.gid) return		
		this.sw_calc_on=0
		game.receive_move(data.move_data)		
	},
	
	async register_sw(){
		
		if ('serviceWorker' in navigator) {
			
			const regs=await navigator.serviceWorker.getRegistrations()
			for (let reg of regs) 
				await reg.unregister()					
								
			const registration=await navigator.serviceWorker.register('./sw.js')
			await navigator.serviceWorker.ready
								
			bot_player.sw = navigator.serviceWorker.controller || registration.active;
			console.log(bot_player.sw);
			console.log('Service Worker is now active and ready!');
								
			navigator.serviceWorker.addEventListener('message', (event) => {
				console.log('Data received from Service Worker:', event.data);
				bot_player.inc_move(event.data)
			});	
		}		
	},
	
	async stop(result) {
		
		const res_array = [
			['my_stop' ,DRAW, ['Вы отменили игру!','You canceled the game']],
			['both_finished',DRAW, 'Ничья'],
			['my_finished_first',WIN , ['Вы выиграли!\nБыстрее соперника добрались до цели','You have won!\nGot to the goal faster than the opponent']],
			['opp_finished_first',LOSE, ['Вы проиграли!\nСоперник оказался быстрее вас.','You have lost!\nThe opponent was faster than you.']],
			['my_closer_after_80',WIN , ['Вы выиграли!\nВы оказались ближе к цели.','You have won!\nYou were closer to the goal.']],
			['opp_closer_after_80',LOSE, ['Вы проиграли!\nСоперник оказался ближе к цели.','You have lost!\nThe opponent was closer to the goal']],
			['both_closer_80',DRAW , ['Ничья!\nОба на одинаковом расстоянии до цели','Draw!\nBoth at the same distance to the goal']]
		];
						
		this.no_incoming_move = 1;
		
		const result_number = res_array.find( p => p[0] === result)[1];
		const result_info = res_array.find( p => p[0] === result)[2][LANG];				
							
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			sound.play('lose');
		else
			sound.play('win');		
		this.gid=0		
		
		await big_message.show(result_info, ['Сыграйте с реальным соперником для получения рейтинга','Play online with other player to increase rating'][LANG],true)

	},
	
	silent_stop() {
				
		//убираем кнопку стоп
		objects.stop_bot_btn.visible=false;
		this.gid=0
		
	},
	
	reset_timer() {
		
		objects.timer_bcg.tint=0xbbbbff;	
		objects.timer_cont.x = [650,10][my_turn];	
		
	},

	
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
		if(this.resolver) this.resolver(0);
		
		objects.chat_keyboard_text.text ='';
		objects.chat_keyboard_control.text = this.MAX_SYMBOLS;
				
		anim3.add(objects.chat_keyboard_cont,{y:[450, objects.chat_keyboard_cont.sy,'linear'],alpha:[0,1,'linear']}, true, 0.2);	


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
		
		anim3.add(objects.chat_keyboard_hl,{alpha:[1, 0,'linear']}, false, 0.5);
		
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
		anim3.add(objects.chat_keyboard_cont,{y:[objects.chat_keyboard_cont.y,450,'linear'],alpha:[1,0,'linear']}, false, 0.2);		
		
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

gif_sel={
	
	updating:0,
	sel_id:-1,
	prv_send:0,
	ids:0,
	
	activate(){
		
		if (!this.ids) this.ids=this.get_unique_int(100,typeof MAX_GIF_ID_INC !== 'undefined' ? MAX_GIF_ID_INC : 200,new Date(SERVER_TM).getDate(),my_data.uid)
		this.sel_id=-1
		objects.gif_sel_hl.visible=false
		objects.gif_sel_send_btn.visible=false
		anim3.add(objects.gif_sel_cont,{x:[800, objects.gif_sel_cont.sx,'linear']}, true, 0.1);
		this.update()
		
	},
	
	async update(){
	
		if (this.updating) return
		this.updating=1
	
		for (let i=0;i<4;i++){
			
			const gif_id=this.ids[i]
			const gif_sprite=objects.gifs[i]
			const base_t=await this.load_gif(`${COM_URL}/gifs/${gif_id}.mp4`)
			
			if(!base_t) continue
			base_t.resource.source.play();
			base_t.resource.source.loop=true;

			gif_sprite.texture=PIXI.Texture.from(base_t)
			
			const scaleX = 140 / base_t.width
			const scaleY = 110 / base_t.height
			const scale = Math.min(scaleX, scaleY)
				
			gif_sprite.width = base_t.width * scale;
			gif_sprite.height = base_t.height * scale;
		}
		this.updating=0
		
	},
	
	load_gif(url){
		
		return new Promise(res=>{
			
			const timeout = setTimeout(()=>{res(0)},2500)

			//если уже загружали неправильную текстуру
			if(PIXI.utils.BaseTextureCache[url]&&!PIXI.utils.BaseTextureCache[url].valid) {
				res(0)
				clearTimeout(timeout)
			}
			const bt = PIXI.BaseTexture.from(url)
			
			if (bt.width) {res(bt);clearTimeout(timeout)}
			bt.on('loaded', ()=>{res(bt);clearTimeout(timeout)})
			bt.on('error', e=>{res(0);clearTimeout(timeout)})
		});
			
	},
	
	close_btn_down(){
		
		if (anim3.any_on()) return
		this.close()
		
	},
	
	gif_down(id){
		
		if (this.sel_id===-1)
			anim3.add(objects.gif_sel_send_btn,{alpha:[0,1,'linear']}, true, 0.1)
		
		this.sel_id=id
		const gif_sprite=objects.gifs[id]
		objects.gif_sel_hl.x=gif_sprite.x
		objects.gif_sel_hl.y=gif_sprite.y
		objects.gif_sel_hl.visible=true
		
	},
		
	get_unique_int(min, max,day,uid) {//inclusive
		
		let seed = hf.hash(`${day}-${uid}`);

		function random() {
			seed |= 0;
			seed = seed + 0x6D2B79F5 | 0;
			let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
			t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		}

		const size = max - min + 1;

		// Build [min ... max]
		const arr = Array.from({ length: size }, (_, i) => i + min);

		// Partial Fisher–Yates (only 4 picks)
		for (let i = 0; i < 4; i++) {
			const j = i + Math.floor(random() * (size - i));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}

		return arr.slice(0, 4);
	},
	
	send_btn_down(){

		const sec_to_wait=Math.round(60-(TM.s-this.prv_send))

		if (sec_to_wait>0){
			pmsg.add({t:[`Подождите\n${sec_to_wait} сек.`,`Wait\n${sec_to_wait} sec.`][LANG]})
			return
		}

		this.prv_send=TM.s
		//console.log(`чуть не отправили ${this.sel_id}`)
		const gif_id=this.ids[this.sel_id]
		my_ws.safe_send({cmd:'push',path:'chat',val:{uid:my_data.uid,name:my_data.name,msg:'',gif_id,tm:'TMS'}})
	},
	
	close(){
		anim3.add(objects.gif_sel_cont,{x:[objects.gif_sel_cont.x,800,'linear']}, false, 0.1);
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
						
		//включаем кнопки так как они были отключены в туториале
		objects.move_confirm_btn.interactive=true;
		objects.move_decline_btn.interactive=true;
		
		//закрываем то что открыто
		if (bot_player.on) bot_player.silent_stop()		
		if (objects.chat_cont.visible) chat.close()			
		if (game_watching.on) game_watching.close()
		if (lobby.on) lobby.close()
		if (game_tutor.on) game_tutor.close()		
		if (objects.maze_logo.visible) main_menu.close()		
		if (objects.lb_1_cont.visible) lb.close()
		
		//это если обработка стен
		this.stop_wall_processing();
				
		my_role=role
		this.opponent = opponent;
		
		if (my_role === 'master') {
			my_turn = 1	
			pmsg.add({t:['Вы ходите первым. Последний ход за соперником.','You go first. The last move is for the opponent'][LANG]})
		} else {
			my_turn = 0			
			pmsg.add({t:['Вы ходите вторым. Последний ход за Вами.','You go second. The last move is yours'][LANG]})
		}
		
		//это то что могло остаться от игры с ботом
		objects.move_opt_cont.visible=false;

		//убираем элементы
		objects.timer_cont.visible=false

		some_process.player_selected_processing = function(){};
				
		//инициируем все что связано с оппонентом
		await this.opponent.activate(my_role)		
		
		objects.opp_icon.texture = assets.chips[opp_data.chip]	
		objects.opp_icon.alpha=1	
		
		objects.my_icon.texture = assets.chips[my_data.chip]						
		objects.my_icon.alpha=1				
		
		//это если фишки совпадают
		if (opp_data.chip===my_data.chip)
			objects.opp_icon.tint=0x88ff88
		else
			objects.opp_icon.tint=0xffffff			
	
				
		//воспроизводим звук о начале игры
		sound.play('game_start')		
		
		//заполняем мою карточку
		objects.my_card_cont.visible = true
		objects.my_avatar.texture=players_cache[my_data.uid].texture
		objects.my_card_name.set2(my_data.name,150)
		objects.my_card_rating.text = my_data.rating	
		
		//заполняем карточку соперника
		const opp_data_cache=players_cache[opp_data.uid]
		objects.opp_card_cont.visible = true
		objects.opp_avatar.texture=opp_data_cache.texture
		objects.opp_card_name.set2(opp_data_cache.name,150)
		objects.opp_card_rating.text = opp_data_cache.rating
						
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
		
		anim3.add(objects.my_icon,{y:[450, 400,'linear']}, true, 0.5);	
		await anim3.add(objects.opp_icon,{y:[-50, 0,'linear']}, true, 0.5);	
		
		//обновляем поле
		ffunc.draw(this.field)	

		this.update_moves_to_win(this.field);
		
	},
		
	async stop(result){
						
		//отключаем взаимодейтсвие с доской
		objects.field.pointerdown = function() {}
		
		//отключаем процессинги
		some_process.player_selected_processing = function(){}
		some_process.wall_processing = function(){}


		//включаем запрет входящих ходов - это также остановит расчет бота если он идет
		this.opponent.no_incoming_move = 1;
				
		objects.move_btns_cont.visible=false
				
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
		objects.timer_cont.visible=false;		
		
		//убираем кнопки
		objects.chat_btn.visible=false
		objects.send_sticker_btn.visible=false
		objects.giveup_btn.visible=false
		objects.stop_bot_btn.visible=false;
		
		//убираем ходы если они остались
		this.show_my_moves(0)
				
		opp_data.uid=''
						
		//показыаем рекламу		
		ad.show()
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state:'o'})	
		
		//показываем главное меню
		main_menu.activate()
			
	},
		
	stop_down(){		
		
		if (objects.big_msg_cont.visible || objects.req_cont.visible) {
			sound.play('bad_move');
			return;			
		}
		
		this.stop('my_stop')		
		
	},
	
	async mouse_down(e){
		
		if (!my_turn) {
			pmsg.add({t:['Не твоя очередь','Not you turn'][LANG]})
			return;
		}
				
		if (objects.big_msg_cont.visible|| objects.req_cont.visible|| !objects.my_icon.ready) {
			sound.play('bad_move');
			return;			
		}
		
		//координаты указателя
		const mx = e.data.global.x/app.stage.scale.x;
		const my = e.data.global.y/app.stage.scale.y;

		//координаты указателя на игровой доске
		const _c = Math.floor(9*(mx-objects.field.x-FIELD_MARGIN_X)/450)
		const _r = Math.floor(9*(my-objects.field.y-FIELD_MARGIN_Y)/450)
		const _id = _c + _r * 8;
		let p = this.field.pos[MY_ID]; p ={r:p.r, c:p.c};
		
		const player_cell_selected = (p.r === _r && p.c === _c);
		
		//выбрана ячейка с игроком
		if (player_cell_selected&&!this.selected) {			
						
			sound.play('checker_tap');
			
			//если происходит строительство стены то отменяем
			if (objects.move_btns_cont.visible)
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
			let s_move =_r.toString() + _c.toString()
			if (!this.av_moves.includes(s_move)) {
				pmsg.add({t:['Сюда нелья ходить','Invalid move'][LANG]})
				return;			
			}

			sound.play('checker_tap');			
						
			//убираем выделение
			this.selected = null

			//убираем варианты движения
			this.show_my_moves(0);	
			
			//плавно переставляем и ждем завершения
			await this.update_player_pos(objects.my_icon, p.r, p.c, _r, _c)	
			
			//обновляем движение на поле
			ffunc.make_move(this.field, p.r, p.c, _r , _c )
			
			//обновляем поле
			ffunc.draw(this.field);		
								
			//отправляем ход сопернику перевернув			
			this.process_move({type: 'move',r0 : 8 - p.r, c0 : 8 - p.c, r1: 8 - _r, c1: 8 - _c});
			return;
		}
		
		//выбрали пустую ячейку для строительства стены
		if (!player_cell_selected) {
			
			if (this.field.pos[MY_ID].walls===0) {
				pmsg.add({t:['Больше построить стену нельзя','You have no walls'][LANG]})
				return;
			}
			
			if (this.sel_cell.r!==_r||this.sel_cell.c!==_c)
				this.sel_cell_wall_iter = 0	
			
			
			this.sel_cell={r: _r, c: _c}	
			
			const wall_ok = this.show_wall_opt()
			if (wall_ok === 1) {
				objects.move_btns_cont.visible = true;				
				some_process.wall_processing=this.wall_processing
			}

		}		
	
	},
	
	player_selected_processing(){
		
		objects.my_icon.alpha = Math.abs(Math.sin(TM.s * 5));
		
	},
	
	wall_processing(){
		
		if (objects.h_wall.visible === true)
			objects.h_wall.alpha = Math.abs(Math.sin(TM.s * 5));
		if (objects.v_wall.visible === true)
			objects.v_wall.alpha = Math.abs(Math.sin(TM.s * 5));
	},
	
	async update_player_pos(sprite, r1, c1, r2, c2) {
		
		let x1 = objects.field.x + FIELD_MARGIN_X + c1 * 50;
		let y1 = objects.field.y + FIELD_MARGIN_Y + r1 * 50;
		let x2 = objects.field.x + FIELD_MARGIN_X + c2 * 50;
		let y2 = objects.field.y + FIELD_MARGIN_Y + r2 * 50;
									
		await anim3.add(sprite,{x:[x1, x2,'linear'],y:[y1,y2,'linear']}, true, 0.25);
		sprite.alpha = 1;
		
	},
	
	confirm_move(){
		
		//короткое обращение
		let pw = this.pending_wall;
			
		
		//создаем поле для проверки блокировки оппонента и игрока
		let pf = JSON.parse(JSON.stringify(this.field));
		pf.f[pw.r][pw.c].wall_type = pw.wall_type;
		
		if (ffunc.blocked_way(pf, pf.pos[OPP_ID].r, pf.pos[OPP_ID].c, ROW8, 1) === 1) {
			pmsg.add({t:['Нельзя полностью блокировать соперника','Cannot completely block opponent'][LANG]});
			sound.play('locked')
			return;
		}	
		
		pf = JSON.parse(JSON.stringify(this.field));
		pf.f[pw.r][pw.c].wall_type = pw.wall_type;
		
		if (ffunc.blocked_way(pf, pf.pos[MY_ID].r, pf.pos[MY_ID].c, ROW0, 1) === 1) {
			sound.play('locked')
			pmsg.add({t:['Так у вас не будет пути до финиша','So you wanna block yourself?'][LANG]})
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
	
	process_move(data){
				
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
	
	get_game_state(){
		
			
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
	
	decline_move(){		
		
		//воспроизводим звук
		sound.play('cancel_wall');
		this.wall_to_try=V_WALL;
		this.stop_wall_processing();
		
	},
	
	stop_wall_processing(){
		
		objects.h_wall.visible = false
		objects.v_wall.visible = false
		this.sel_cell_wall_iter = 0
		objects.move_btns_cont.visible = false
		some_process.wall_processing = function(){}
	},
			
	show_wall_opt(id){
		
		objects.h_wall.visible=false;
		objects.v_wall.visible=false;
					
		//тип стены
		//c смещение
		//r смещение
		//следующая ячейка
		const p = [[V_WALL,0,0,1],[H_WALL,0,0,2],[H_WALL,0,1,3],[V_WALL,0,1,4],[V_WALL,1,1,5],[H_WALL,1,1,6],[H_WALL,1,0,7],[V_WALL,1,0,0]]
		
		//убираем кнопку подтверждения так как пока не понятно найдутся ли стены для данной ячейки
		objects.move_btns_cont.visible = false;
	
		
		let g_pos = this.sel_cell_wall_iter
		
		for (let i = 0 ; i < 8 ; i++) {
			
			let wp = p[g_pos];			
			
			if (this.sel_cell_wall_iter === g_pos) {
								
				const r = this.sel_cell.r + wp[1]								
				const c = this.sel_cell.c + wp[2]				
				
				this.sel_cell_wall_iter++;
				if (this.sel_cell_wall_iter > 7)
					this.sel_cell_wall_iter = 0	
											
				//если стену нельзя поставить выбираем следующую конфигурацию								
				const check = ffunc.check_new_wall(this.field, r, c, wp[0])
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
				sound.play('iter_wall');
				return 1;
			}			
		}
		
		sound.play('locked');
		return 0
	},
			
	show_my_moves(show){
				
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
	
	async receive_move(data){
		
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
			pmsg.add({t:[`После ${MAX_MOVES} хода выиграет тот кто ближе к цели`,`After ${MAX_MOVES} move the one who is closer to the goal will win`][LANG]});
		}
		
		this.update_moves_to_win(this.field);		
		
	}

}

game_watching={
	
	game_id:0,
	field:{},
	on:0,
	anchor_uid:'',
	master_uid:'',
	slave_uid:'',
	
	async activate(card_data){
		
		this.on=1
		ffunc.init(this.field)
		objects.field.visible = true
		objects.my_icon.visible = true
		objects.opp_icon.visible = true
		objects.stop_gw_btn.visible = true
		
		this.anchor_uid=card_data.uid1;
		
		this.game_id=card_data.game_id;
		
		
		//показываем карточки игроков		
		objects.my_card_cont.visible=true
		objects.opp_card_cont.visible=true	
		
		//получаем остальные данные об игроке
		const chip1=await fbs_once('players/'+card_data.uid1+'/chip')||0
		const chip2=await fbs_once('players/'+card_data.uid2+'/chip')||0
			
		
		//фишки
		
		//это если фишки совпадают
		if (chip1===chip2)
			objects.picon1.tint=objects.opp_icon.tint=0x88ff88;
		else
			objects.picon1.tint=objects.opp_icon.tint=0xffffff;
		
		objects.my_icon.texture =objects.picon0.texture=assets.chips[chip1]
		objects.opp_icon.texture =objects.picon1.texture=assets.chips[chip2]
		
		objects.picon0.visible=objects.picon1.visible=true;
		
		//аватарки		
		const main_data=await fbs_once('tables/'+this.game_id);
		
		const master_data=players_cache[card_data.uid1];
		const slave_data=players_cache[card_data.uid2];
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
		
		if (anim3.any_on()) {
			sound.play('locked');
			return;
		}
		sound.play('close_it');
		
		this.close();
		lobby.activate();		
	},
	
	async new_move(data){
		
		if(data===null || data===undefined || objects.big_msg_cont.visible)
			return;
			
		if(data.fin_flag){			
			await big_message.show("This game is finished",")))",false);
			this.stop_and_return();
			return;
		}
		
		sound.play('gw_move')
		
		
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
		objects.my_icon.visible = false
		objects.opp_icon.visible = false
		objects.my_card_cont.visible = false
		objects.stop_gw_btn.visible = false
		objects.opp_card_cont.visible = false
		objects.walls.forEach(w=>{w.visible=false})
		objects.picon0.visible=objects.picon1.visible=false
		firebase.database().ref("tables/"+this.game_id).off()	
		this.on=0

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
		
		objects.my_icon.texture = assets.chips[4]
		objects.opp_icon.texture = assets.chips[5]
		
		//это то что могло остаться от игры с ботом
		objects.move_opt_cont.visible=false;
		objects.stop_bot_btn.visible=true;
		objects.stop_bot_btn.pointerdown=function(){game_tutor.stop()};
		some_process.player_selected_processing = function(){};
		
		objects.move_confirm_btn.interactive=false;
		objects.move_decline_btn.interactive=false;
											
		//показываем карточки игроков		
		objects.my_card_cont.visible = true;
		objects.my_card_name.text=['Игрок 1', 'Player 1'][LANG];
		objects.my_avatar.texture=assets.chips[4];
		objects.my_card_rating.text='-';
		
		objects.opp_card_cont.visible = true;		
		objects.opp_card_name.text=['Игрок 2', 'Player 2'][LANG];
		objects.opp_avatar.texture=assets.chips[5];
		objects.opp_card_rating.text='-';
		
		//отключаем взаимодейтсвие с доской
		objects.field.pointerdown = null;		
			
		//формируем игровое поле
		ffunc.init(game.field);	

		//показываем игровое поле
		objects.field.visible = true;		
				
		//убираем таймер
		objects.timer_cont.visible=false;		

				
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
		
		anim3.add(objects.my_icon,{y:[450, 400,'linear']}, true, 0.5);	
		anim3.add(objects.opp_icon,{y:[-50, 0,'linear']}, true, 0.5);	
		
		//обновляем поле
		ffunc.draw(game.field)		
		
		this.time=0;
		this.next_frame=0;
		some_process.tutor=function(){game_tutor.run()};
				
	},
	
	stop(){
		
		if (anim3.any_on()) return;
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
						const obj_name=frame.obj
						const time=frame.time
						const func=frame.func				
						const params=frame.params
						Object.values(params).forEach(p=>p[2]=func)
						const vis_on_end=frame.vis_on_end
						anim3.add(objects[obj_name],params,vis_on_end,time)						
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
		objects.move_btns_cont.visible=false;
		objects.stop_bot_btn.visible=false;
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

	on:0,
	loading:{},

	async update(uid,params={}){

		//ссылка на игрока
		this[uid]||={}
		const player=this[uid]

		if (this.loading[uid]) return


		while(Object.keys(this.loading).length>5){
			console.log('Много загрузок, ждем...')
			await new Promise(r => setTimeout(r, hf.randIntInc(400,800)));
		}

		this.loading[uid]=1

		//загружаем имя если нет данных
		if (!player.name) {
			console.log(`загружаем name для ${uid}, заявитель ${params.source}`)
			player.name=await fbs_once('players/'+uid+'/name')
		}

		//загружаем картинку если нет данных
		if (!player.pic_url) {
			console.log(`загружаем pic_url для ${uid} ${player.name}, заявитель ${params.source}`)
			player.pic_url=await fbs_once('players/'+uid+'/pic_url')
		}

		//загружаем рейтинг если нет данных
		if (!player.rating||params.rating) {
			console.log(`загружаем rating для ${uid} ${player.name}, заявитель ${params.source}`)
			player.rating=await fbs_once('players/'+uid+'/rating')
		}

		//загружаем аватар если нет данных
		if (!player.texture) {
			console.log(`загружаем texture для ${uid} ${player.name}, заявитель ${params.source}`)
			player.texture=await this.my_texture_from(player.pic_url)
		}

		//переносим в req_dialog
		//req_dialog.cache_updated(uid,player)

		//переносим в чат
		chat.cache_updated(uid,player)

		//переносим в чат
		lobby.cache_updated(uid,player)

		//в турнир
		//trnm.cache_updated(uid,player)

		//в игру
		//game.cache_updated(uid,player)

		delete this.loading[uid]

	},

	get_pdata(uid){

		if (!this[uid]) return 0
		if (!this[uid].texture) return 0
		return this[uid]
	},

	update_params(uid,params){

		//ссылка на игрока
		this[uid]||={}
		const player=this[uid]

		//загружаем картинку если нет данных
		if (params.pic_url)
			player.pic_url=params.pic_url

		//загружаем имя если нет данных
		if (params.name)
			player.name=params.name

		//загружаем рейтинг если нет данных
		if (params.rating)
			player.rating=params.rating

	},

	my_texture_from(pic_url){

		const white_tex = PIXI.Texture.WHITE;

		if (!pic_url) return white_tex
		
		// Handle multiavatar
		if (pic_url.includes('mavatar')) pic_url = multiavatar(pic_url)
		
		return new Promise(res => {
			const timeout = setTimeout(() => {
			console.log('Timeout to load: ', pic_url);
			res(white_tex);
		}, 2000);

		PIXI.Texture.fromURL(pic_url).then(t => {
				clearTimeout(timeout);
				res(t||white_tex);
			})
			.catch((error) => {
				clearTimeout(timeout);
				console.error('Failed to load texture:', error);
				res(white_tex);
			});
		});
	},

	async update_avatar_forced(uid, pic_url){

		const player=this[uid];
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
		if ( sec_passed > 100 )	firebase.database().ref(ROOM_NAME+'/'+my_data.uid).remove();
		return;		
	}

	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(ROOM_NAME+'/'+my_data.uid).onDisconnect().remove();

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
			if (msg.message==='CHAT')
				online_game.chat(msg.data);
					
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
			if (msg.sender === req_dialog.uid)
				req_dialog.hide(msg.sender);
		}
	}
}

req_dialog = {

	uid:0,
	silent_mode_tm:0,

	async show(uid) {


		//если активен режим тишины
		const tm=Date.now();
		if(tm<this.silent_mode_tm){
			fbs.ref('inbox/'+uid).set({sender:my_data.uid,message:'REJECT_ALL',tm:Date.now()});
			return;
		}

		//фиксируем UID
		this.uid=uid

		//обновляем данные
		await players_cache.update(uid,{rating:1})
		const pdata=players_cache[uid]
		if (uid!==this.uid) return

		sound.play('receive_sticker');
		objects.req_deny.alpha=1
		objects.req_ok.alpha=1

		//Отображаем  имя и фамилию в окне приглашения
		objects.req_name.set2(pdata.name,200)
		objects.req_rating.text=pdata.rating
		objects.req_avatar.set_texture(pdata.texture)

		anim3.add(objects.req_cont, {y: [-260, objects.req_cont.sy, 'easeOutElastic']}, true, 0.75);

	},

	deny_btn_down() {

		if (anim3.any_on()){
			sound.play('locked');
			return;			
		}

		
		objects.req_deny.alpha=0.4
		sound.play('close_it');

		//подсветка
		//objects.req_btn_hl.x=objects.req_deny_btn.x;
		//objects.req_btn_hl.y=objects.req_deny_btn.y;
		//anim3.add(objects.req_btn_hl, {alpha: [0, 1, 'ease3peaks']}, false, 0.25, false);

		anim3.add(objects.req_cont, {y: [objects.req_cont.sy, -260, 'easeInBack']}, false, 0.5);

		fbs.ref("inbox/"+req_dialog.uid).set({sender:my_data.uid,message:'REJECT',tm:Date.now()});
	},

	accept_btn_down() {

		if (anim3.any_on()||game.state==='online'||game.state==='big_msg'||game.state==='ad') {
			sound.play('locked');
			return;
		}

		//подсветка
		objects.req_ok.alpha=0.4

		//фиксируем ИД соперника
		opp_data.uid=this.uid

		anim3.add(objects.req_cont, {y: [objects.req_cont.sy, -260, 'easeInBack']}, false, 0.5);

		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*99999)
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'ACCEPT',tm:Date.now(),game_id:game_id})

		lobby.close();
		game.activate("slave" , online_game );
		//game2.activate('slave');

	},

	hide() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;

		anim3.add(objects.req_cont, {y: [objects.req_cont.sy, -260, 'easeInBack']}, false, 0.5);

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
		objects.pref_avatar.set_texture(players_cache[my_data.uid].texture);	
		objects.pref_rating.text=['Рейтинг: ','Rating: '][LANG]+my_data.rating;
		objects.pref_games.text=['Игры: ','Games: '][LANG]+my_data.games;
		
		
		this.update_available_actions();
		this.avatar_switch_center=this.avatar_swtich_cur=irnd(9999,999999);
		
	},
	
	async update_available_actions(){
		
		const tm=Date.now();
		if (tm-this.last_serv_tm_check<30000) return;
		this.last_serv_tm_check=tm;		
		SERVER_TM||=await my_ws.get_tms()
		
		if (!SERVER_TM){
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
			return 'hours';
		} else if (lastDigit == 1) {
			return 'hour';
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return 'hours';
		} else {
			return 'hours';
		}
	},
		
	update_buttons(){
		
		objects.pref_conf_photo_btn.visible=false;
		
		//сколько осталось до изменения
		this.hours_to_nick_change=Math.max(0,Math.floor(720-(SERVER_TM-my_data.nick_tm)*0.001/3600));
		this.hours_to_photo_change=Math.max(0,Math.floor(720-(SERVER_TM-my_data.avatar_tm)*0.001/3600));
		
		//определяем какие кнопки доступны
		objects.pref_change_name_btn.alpha=(this.hours_to_nick_change>0||my_data.games<200||!SERVER_TM)?0.5:1;
		objects.pref_arrow_left.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;
		objects.pref_arrow_right.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;	
		objects.pref_reset_avatar_btn.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;	
		
	},
	
	send_info(msg,timeout){
		
		objects.pref_info.text=msg;
		anim3.add(objects.pref_info,{alpha:[0,1,'linear']}, true, 0.25,false);
		clearTimeout(this.info_timer);
		this.info_timer=setTimeout(()=>{
			anim3.add(objects.pref_info,{alpha:[1,0,'linear']}, false, 0.25,false);	
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
			anim3.add(objects.pref_info,{alpha:[0,1,'easeBridge']}, false, 3,false);	
			sound.play('locked');
			return 0;
		}
		
		return 1;
	},
	
	async change_name_down(){
		
		if (!SERVER_TM){
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
			this.send_info(`Wait  ${this.hours_to_nick_change} ${this.getHoursEnding(this.hours_to_nick_change)}.`);
			sound.play('locked');
			return;
		} 
		
		
		sound.play('click');
		
		//получаем новое имя
		const name=await keyboard.read(15);
		if (name&&name.replace(/\s/g, '').length>3){			
			
			//обновляем данные о времени
			my_data.nick_tm=SERVER_TM;
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm);	
						
			my_data.name=name;	
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name);			
			
			this.update_buttons();		
			
			objects.pref_name.set2(name,260);
			this.send_info(['Вы изменили имя)))','Name is changed!'][LANG]);
			sound.play('note');	
			
		}else{			
			this.send_info(['Неправильное имя(((','Invalid name!'][LANG]);
			anim3.add(objects.pref_info,{alpha:[0,1,'easeBridge']}, false, 3,false);			
		}		
	},
	
	async reset_avatar_down(){
				
		if (!SERVER_TM){
			this.send_info(['Ошибка получения серверного времени(((','Server time error!'][LANG]);
			sound.play('locked');
			return;
		}
								
		if (anim3.any_on()||this.tex_loading) {
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
		
		my_data.avatar_tm=SERVER_TM;		
		fbs.ref(`players/${my_data.uid}/pic_url`).set(this.cur_pic_url);
		fbs.ref(`players/${my_data.uid}/avatar_tm`).set(my_data.avatar_tm);			
			
		this.send_info(['Вы изменили фото)))','Your photo has been changed!'][LANG]);
		sound.play('note');	

		this.update_buttons();		
		
		//обновляем аватар в кэше
		players_cache.update_avatar_forced(my_data.uid,this.cur_pic_url).then(()=>{
			const my_card=objects.mini_cards.find(card=>card.uid===my_data.uid);
			my_card.avatar.set_texture(players_cache[my_data.uid].texture);				
		})	
			
	},
		
	async arrow_down(dir){
		
		if (!SERVER_TM){
			this.send_info(['Ошибка получения серверного времени(((','Server time error!'][LANG]);
			sound.play('locked');
			return;
		}
		
		if (anim3.any_on()||this.tex_loading) {
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
			this.cur_pic_url=players_cache[my_data.uid].pic_url
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
		
		if(anim3.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.switch();
		sound.play('click');
		const tar_x=sound.on?370:323; //-38
		anim3.add(objects.pref_sound_slider,{x:[objects.pref_sound_slider.x,tar_x,'linear']}, true, 0.1);	
		
	},
		
	switch_to_lobby(){
		
		this.close();
		
		//показываем лобби
		anim3.add(objects.cards_cont,{x:[800,0,'linear']}, true, 0.2);		
		anim3.add(objects.lobby_footer_cont,{y:[450,objects.lobby_footer_cont.sy,'linear']}, true, 0.2);
		
	},
	
	close(){
		
		//убираем контейнер
		anim3.add(objects.pref_cont,{x:[objects.pref_cont.x,-800,'linear']}, false, 0.2);
		anim3.add(objects.pref_footer_cont,{y:[objects.pref_footer_cont.y,450,'linear']}, false, 0.2);	
		
	},
	
	ok_btn_down(button_data){
		
		if(anim3.any_on()){
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
			anim3.add(chip_spr,{scale_xy:[0.666, 1,'ease2back'],angle:[0,10,'ease2back']}, true, 0.5);	
		}else{
			sound.play('locked');	
			this.send_info(['Это ваша текущая фишка!','This is your current chip!'][LANG]);
		}
	},	
	
	chip_down(){
		
		

		const req=pref.ICONS_DATA[this.chip_id];
		if(my_data.rating<req.rating&&my_data.games<req.games){		
			sound.play('locked');	
			anim3.add(objects.pref_info,{alpha:[0,1,'easeBridge']}, false, 3,false);	
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

	show_panel() {


		if (!online_game.on || objects.req_cont.visible || !objects.stickers_cont.ready || state!=="p") {
			sound.play('locked')
			return
		}
		
		sound.play('click')

		//анимационное появление панели стикеров
		anim3.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy,'easeOutBack']}, true, 0.5);

	},

	hide_panel() {

		//game_res.resources.close.sound.play();

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim3.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450,'easeInBack']}, false, 0.5);

	},

	async send(id) {

		if (!online_game.on || objects.req_cont.visible || !objects.stickers_cont.ready || state!=="p") {
			sound.play('locked')
			return
		}

		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		pmsg.add({t:['Стикер отправлен сопернику','Sticker sent!'][LANG]})

		//показываем какой стикер мы отправили
		//objects.sent_sticker_area.texture=assets['sticker_texture_'+id];
		//await anim3.add(objects.sent_sticker_area,{alpha:[0, 0.5]}, true, 0.5,'linear');

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_send = resolve;
				setTimeout(resolve, 2000)
			}
		);

		if (res === "forced")
			return;

		//await anim3.add(objects.sent_sticker_area,{alpha:[0.5, 0]}, false, 0.5,'linear');
	},

	async receive(id) {


		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive("forced");

		//воспроизводим соответствующий звук
		sound.play('receive_sticker')

		objects.rec_sticker_area.texture=assets['sticker_texture_'+id];

		await anim3.add(objects.rec_sticker_area,{x:[-150, objects.rec_sticker_area.sx,'easeOutBack']}, true, 0.5);

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_recive = resolve;
				setTimeout(resolve, 2000)
			}
		);

		if (res === "forced")
			return;

		anim3.add(objects.rec_sticker_area,{x:[objects.rec_sticker_area.sx, -150,'easeInBack']}, false, 0.5);

	}

}

main_menu={

	logo_dx : 0.2,

	
	activate() {
		
		//просто добавляем контейнер с кнопками
		objects.bcg.texture=assets.bcg;
		objects.bcg.visible = true;
		
		//anim3.add(objects.maze_logo_top,{alpha: [0,1]}, true, 1,'easeInOutCubic');
		anim3.add(objects.maze_logo,{alpha: [0,1,'linear'],y:[-200, objects.maze_logo.sy,'linear']}, true, 1);
		anim3.add(objects.main_btns_cont,{y:[450, objects.main_btns_cont.sy,'linear'],alpha: [0,1,'linear']}, true, 0.75);
				
		anim3.add(objects.flame_0,{alpha: [0,1,'linear']}, true, 0.5);
		anim3.add(objects.flame_1,{alpha: [0,1,'linear']}, true, 0.2);
		
		objects.flame_0.play();
		objects.flame_1.play();
		
		objects.flame_0.animationSpeed=0.25;
		objects.flame_1.animationSpeed=0.25;
	},	

	async close() {

		anim3.add(objects.maze_logo,{alpha: [1,0,'linear']}, false, 0.5);
		anim3.add(objects.main_btns_cont,{y:[ objects.main_btns_cont.y, 450,'linear'],alpha: [1,0,'linear']}, true, 0.5);
		anim3.add(objects.flame_0,{alpha: [1,0,'linear']}, false, 0.5);
		anim3.add(objects.flame_1,{alpha: [1,0,'linear']}, false, 0.2);
	},

	play_btn_down: async function () {

		if (objects.big_msg_cont.visible === true || objects.id_cont.visible === true || objects.req_cont.visible === true ||  objects.main_btns_cont.ready === false) {
			sound.play('bad_move');
			return;			
		}


		sound.play('click');

		await this.close();
		lobby.activate();

	},

	lb_btn_down () {

		if (objects.big_msg_cont.visible === true || objects.req_cont.visible === true ||  objects.main_btns_cont.ready === false) {
			sound.play('bad_move');
			return;			
		}

		sound.play('click');

		this.close();
		lb.show();

	},

	rules_btn_down () {

		if (objects.big_msg_cont.visible|| objects.req_cont.visible|| !objects.main_btns_cont.ready||!objects.rules_cont.ready) {
			sound.play('bad_move');
			return;			
		}
		
		sound.play('click');
		
		//отображаем текущую фищку
		this.chip_id=my_data.chip;
		objects.chip_sel_frame.x=objects.chip_icons[my_data.chip].x-10;
		objects.chip_sel_frame.y=objects.chip_icons[my_data.chip].y-10;
	
		anim3.add(objects.rules_cont,{y:[-450, objects.rules_cont.sy,'easeOutBack']}, true, 0.5);

	},

	tutor_btn_down(){
		
		if (objects.big_msg_cont.visible|| objects.req_cont.visible||anim3.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('click')
		this.close();
		game_tutor.start();
		
	},

	rules_ok_down () {
		
		if (objects.big_msg_cont.visible === true || objects.req_cont.visible === true ||  objects.rules_cont.ready === false) {
			sound.play('bad_move');
			return;			
		}
		
		sound.play('click');
		

		
		anim3.add(objects.rules_cont,{y:[objects.rules_cont.y,-450,'easeInBack']}, false, 0.5);
	},

	async chat_btn_down() {
		
		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		
		chat.activate();
		
		
	},
	


}

chat={

	on:0,
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
	games_to_chat:0,
	games_to_gif:100,
	payments:0,
	processing:0,

	activate() {

		this.on=1;
		anim3.add(objects.chat_cont, {alpha: [0, 1, 'linear']}, true, 0.1);
		
		objects.chat_enter_btn.alpha=my_data.games>=this.games_to_chat?1:0.25
		objects.chat_gif_btn.alpha=my_data.games>=this.games_to_gif?1:0.25

		objects.bcg.interactive=true;
		objects.bcg.pointermove=this.pointer_move.bind(this);
		objects.bcg.pointerdown=this.pointer_down.bind(this);
		objects.bcg.pointerup=this.pointer_up.bind(this);
		objects.bcg.pointerupoutside=this.pointer_up.bind(this);


		//objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		if(my_data.blocked) objects.chat_rules.text='Вы не можете писать в чат, так как вы находитесь в черном списке';

		//вопроизводитим гифки
		objects.chat_records.forEach(r=>{
			if(r.visible&&r.gif.visible)
				r.gif.texture.baseTexture.resource.source.play();
		})

		this.shift(-2000);
	},

	new_message(data){

		console.log('new_data',data);

	},

	async init(){

		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;

		for(let rec of objects.chat_records) {
			rec.visible = false;
			rec.msg_id = -1;
			rec.tm=0;
		}

		this.init_yandex_payments()

		//загружаем чат
		const chat_data=await my_ws.get('chat',25)

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

	gif_btn_down(){
		
		if (anim3.any_on()) {
			sound.play('locked');
			return
		}
		
		if (my_data.games<this.games_to_gif){
			const left_to_play=this.games_to_gif-my_data.games
			pmsg.add({t:`Need to play ${this.games_to_gif} games.\Left to play: ${left_to_play}`,snd:'locked'})
			return
		}
		
		if (!SERVER_TM) {
			pmsg.add({t:'Locked!',snd:'locked'})
			return
		}
		gif_sel.activate()
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

	async block_player(uid){

		fbs.ref('blocked/'+uid).set(Date.now());
		fbs.ref('inbox/'+uid).set({message:'CHAT_BLOCK',tm:Date.now()});
		const name=await fbs_once(`players/${uid}/name`);
		const msg=`Игрок ${name} занесен в черный список.`;
		my_ws.socket.send(JSON.stringify({cmd:'push',path:'chat',val:{uid:'admin',name:'Админ',msg,tm:'TMS'}}));

		//увеличиваем количество блокировок
		fbs.ref('players/'+uid+'/block_num').transaction(val=> {return (val || 0) + 1});

	},

	async chat_load(data) {

		if (!data) return;

		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);

		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});

		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c,true);
	},

	async chat_updated(data, first_load) {

		//console.log('chat_updated:',JSON.stringify(data).length);
		if(data===undefined||!data.name||!data.uid) return

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
			await anim3.add(objects.chat_msg_cont, {y: [objects.chat_msg_cont.y, objects.chat_msg_cont.y-y_shift, 'linear']}, true, 0.05);
		else
			objects.chat_msg_cont.y-=y_shift

		this.processing=0;

	},

	cache_updated(uid,pdata){

		//if (!this.on) return
		for(let rec of objects.chat_records)
			if (rec.visible&&rec.uid===uid)
				rec.avatar.set_texture(pdata.texture)
	},

	avatar_down(player_data){

		if (player_data.uid==='admin')
			return;

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
			fbs.ref('inbox/'+player_data.uid).set({message:'client_id',tm:Date.now(),client_id:999999});
			console.log('Игрок убит: ',player_data.uid);
			this.kill_next_click=0;
		}


		if(this.moderation_mode||this.block_next_click||this.kill_next_click||this.delete_message_mode) return;

		if (objects.chat_keyboard_cont.visible)
			keyboard.response_message(player_data.uid,player_data.name.text);
		else
			lobby.show_invite_dlg_from_chat(player_data.uid);


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

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('close_it');
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

		this.shift(-delta*30)

	},

	async write_btn_down(){

		if (anim3.any_on()) {
			sound.play('locked')
			return
		};

		if (my_data.games<this.games_to_chat){
			const left_to_play=this.games_to_chat-my_data.games
			pmsg.add({t:`Need to play ${this.games_to_chat} games.\nLeft to play: ${left_to_play}`,snd:'locked'})
			return
		}

		//оплата разблокировки чата
		if (my_data.blocked){

			let block_num=await fbs_once('players/'+my_data.uid+'/block_num');
			block_num=block_num||1;
			block_num=Math.min(9,block_num);
			const item_id='unblock'+block_num
			
			if(game_platform==='YANDEX'){
				
				
				this.payments.purchase({id:item_id}).then(purchase => {
					this.unblock_chat(block_num)
					my_ws.safe_send({cmd:'log_inst',logger:'payments',data:{game_name,uid:my_data.uid,name:my_data.name,item_id}});
				}).catch(err => {
					pmsg.add({t:'Ошибка при покупке!'});
				})
			}

			if (game_platform==='VK') {

				vkBridge.send('VKWebAppShowOrderBox', {type:'item',item:item_id}).then(data =>{
					this.unblock_chat(block_num)
					my_ws.safe_send({cmd:'log_inst',logger:'payments',data:{game_name,uid:my_data.uid,name:my_data.name,item_id}});
				}).catch((err) => {
					pmsg.add({t:'Ошибка при покупке!'});
				});

			};

			return;
		}


		sound.play('click');

		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);

		if (this.recent_msg.length>3){
			pmsg.add({t:['Подождите 1 минуту','Wait 1 minute...'][LANG]})
			return;
		}

		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());

		//пишем сообщение в чат и отправляем его
		const msg = await keyboard.read(70);
		if (msg)
			my_ws.safe_send({cmd:'push',path:'chat',val:{uid:my_data.uid,name:my_data.name,msg,tm:'TMS'}})
	},

	unblock_chat(){
		//objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		objects.chat_enter_btn.texture=assets.chat_enter_img;
		fbs.ref('blocked/'+my_data.uid).remove();
		my_data.blocked=0;
		pmsg.add({t:'Вы разблокировали чат'});
		sound.play('mini_dialog');
	},

	close() {

		this.on=0;
		anim3.add(objects.chat_cont,{alpha:[1, 0,'linear']}, false, 0.1);
		if (objects.chat_keyboard_cont.visible)	keyboard.close()
		if (objects.invite_cont.visible) objects.invite_cont.visible=false
		if (objects.gif_sel_cont.visible) gif_sel.close()	

	}

}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	last_update:0,

	show() {

		objects.bcg.texture=assets.lb_bcg;
		anim3.add(objects.bcg,{alpha:[0,1,'linear']}, true, 0.5);

		anim3.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_cards_cont,{x:[450, 0,'easeOutCubic']}, true, 0.5);

		objects.lb_cards_cont.visible=true;
		objects.lb_back_btn.visible=true;

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
		objects.lb_back_btn.visible=false;
		objects.bcg.texture=assets.bcg;

	},

	back_btn_down() {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};


		sound.play('close_it');
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
		for (const uid in leaders){

			const leader_data=leaders[uid];
			const leader_params={uid,name:leader_data.name, rating:leader_data.rating, pic_url:leader_data.pic_url};
			leaders_array.push(leader_params);
		};
		

		//сортируем....
		leaders_array.sort(function(a,b) {return b.rating - a.rating});

		
		//заполняем имя и рейтинг
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			players_cache.update_params(leader.uid,leader);
			target.t_name.set2(leader.name,place>2?190:130);
			target.t_rating.text=leader.rating;
		}	
		
		//заполняем аватар		
		for (let i=0;i<10;i++){
			const leader=leaders_array[i];
			await players_cache.update(leader.uid,{source:'lb'});
			const target=top[i];
			target.avatar.set_texture(players_cache[leader.uid].texture)
		}

	}


}

lobby={

	activated:false,
	rejected_invites:{},
	fb_cache:{},
	opp_uid:0,
	bot_on:1,
	on:0,
	global_players:{},
	state_listener_on:0,
	state_listener_timeout:0,
	perm_room:'',

	activate() {

		//первый запуск лобби
		if (!this.activated){
			
			//расставляем по соответствующим координатам
			for(let i=0;i<objects.mini_cards.length;i++) {

				const iy=i%4;
				objects.mini_cards[i].y=50+iy*80;

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

		anim3.add(objects.cards_cont, {alpha: [0, 1, 'linear']}, true, 0.1);
		anim3.add(objects.lobby_footer_cont, {y: [450, objects.lobby_footer_cont.sy, 'linear']}, true, 0.1);
		anim3.add(objects.lobby_header_cont, {y: [-50, objects.lobby_header_cont.sy, 'linear']}, true, 0.1);
		objects.cards_cont.x=0;
		this.on=1;

		//отключаем все карточки
		for(let i=0;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false

		//добавляем карточку бота если надо
		this.starting_card=0
		if (!this.perm_room){
			this.starting_card=1
			this.add_card_ai()
		}
				

		//включаем прослушивание если надо
		if (!this.state_listener_on) this.connect()

		//удаляем таймаут слушателя комнаты
		clearTimeout(this.state_listener_timeout);

		this.players_list_updated(this.global_players)

		set_state({state:'o'})

	},

	pref_btn_down(){

		//если какая-то анимация
		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_pref_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_pref_btn.y;
		anim3.add(objects.lobby_btn_hl, {alpha: [0, 1, 'ease3peaks']}, false, 0.25, false);

		//убираем контейнер
		anim3.add(objects.cards_cont, {x: [objects.cards_cont.x, 800, 'linear']}, false, 0.2);
		anim3.add(objects.pref_cont, {x: [-800, objects.pref_cont.sx, 'linear']}, true, 0.2);

		//меняем футер
		anim3.add(objects.lobby_footer_cont, {y: [objects.lobby_footer_cont.y, 450, 'linear']}, false, 0.2);
		anim3.add(objects.pref_footer_cont, {y: [450, objects.pref_footer_cont.sy, 'linear']}, true, 0.2);
		pref.activate();

	},

	players_list_updated(players) {

		//это столы
		let tables = {};

		//это свободные игроки
		let single = {};

		//конвертируем сокращенные данные начали 25.06.2025, нужно позже перейти полностью на сокращенный режим
		for (let uid in players){
			const player=players[uid]
			if (player.n)	player.name=player.n
			if (player.r)	player.rating=player.r
			if (player.s)	player.state=player.s
			if (player.h)	player.hidden=player.h
			if (player.g)	player.game_id=player.g
		}

		//удаляем инвалидных игроков
		for (let uid in players){
			if(!players[uid].name||!players[uid].rating||!players[uid].state)
				delete players[uid];
		}

		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));

		//создаем массив свободных игроков и обновляем кэш
		for (let uid in players){

			const pdata=players[uid]
			
			//обновляем кэш с первыми данными
			players_cache.update_params(uid,pdata)

			if (pdata.state!=='p'&&!pdata.hidden)
				single[uid] = pdata.name;
		}

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

			let found=0;
			for(let i=0;i<objects.mini_cards.length;i++) {
				if (objects.mini_cards[i].visible===true && objects.mini_cards[i].type==='single') {
					if (p===objects.mini_cards[i].uid)
						found=1
				}
			}

			if (found===0)
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
			this.place_new_card({uid,state:players[uid].state, name:players[uid].name, rating:players[uid].rating});

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
		card.name=card.name_text.text=['Бот','Bot'][LANG];

		card.rating=1400;
		card.rating_text.text = card.rating;
		card.avatar.set_texture(assets.pc_icon);

		//также сразу включаем его в кэш
		if(!players_cache.bot){
			players_cache.bot={};
			players_cache.bot.name=['Бот','Bot'][LANG];
			players_cache.bot.rating=1400;
			players_cache.bot.texture=assets.pc_icon;
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

			if (card.visible) continue

			//устанавливаем цвет карточки в зависимости от состояния
			card.bcg.texture=this.get_state_texture(params.state,params.uid);
			card.state=params.state;

			card.type = 'single';

			//присваиваем карточке данные
			card.uid=params.uid;

			//убираем элементы стола так как они не нужны
			card.rating_text1.visible = false
			card.rating_text2.visible = false
			card.avatar1.visible = false
			card.avatar2.visible = false
			card.avatar1_frame.visible = false
			card.avatar2_frame.visible = false
			card.table_rating_hl.visible=false

			//включаем элементы одиночной карточки
			card.rating_text.visible = true
			card.avatar.visible = true
			card.avatar_frame.visible = true
			card.name_text.visible = true

			card.name=params.name
			card.name_text.set2(params.name,105)
			card.rating=params.rating
			card.rating_text.text=params.rating

			card.visible=true

			const a_tex=players_cache[card.uid].texture
			if (a_tex)
				card.avatar.set_texture(a_tex)
			else
				players_cache.update(card.uid)

			//console.log(`новая карточка ${i} ${params.uid}`)
			return;
		}

	},

	place_table(params={uid1:0,uid2:0,name1: 'X',name2:'X', rating1: 1400, rating2: 1400,game_id:0}) {

		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (card.visible) continue

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

			//Включаем элементы стола
			card.table_rating_hl.visible=true;
			card.rating_text1.visible = true;
			card.rating_text2.visible = true;
			card.avatar1.visible = true;
			card.avatar2.visible = true;
			card.avatar1_frame.visible = true;
			card.avatar2_frame.visible = true;
			//card.rating_bcg.visible = true;

			card.rating_text1.text = params.rating1
			card.rating_text2.text = params.rating2

			card.name1 = params.name1;
			card.name2 = params.name2;


			const a_tex1=players_cache[card.uid1].texture
			if (a_tex1)
				card.avatar1.set_texture(a_tex1)
			else
				players_cache.update(card.uid1)


			const a_tex2=players_cache[card.uid2].texture
			if (a_tex2)
				card.avatar2.set_texture(a_tex2)
			else
				players_cache.update(card.uid2)


			card.visible=true;
			card.game_id=params.game_id;

			return
		}

	},

	cache_updated(uid,pdata){

		for (const card of objects.mini_cards){
			if (!card.visible) continue

			if (card.type==='single')
				if (card.uid===uid)
					card.avatar.set_texture(pdata.texture)

			if (card.type==='table'){
				if (card.uid1===uid)
					card.avatar1.set_texture(pdata.texture)

				if (card.uid2===uid)
					card.avatar2.set_texture(pdata.texture)
			}
		}
		
		
		//обновляем сообщение
		if(objects.inst_msg_cont.visible&&objects.inst_msg_cont.uid===uid)
			objects.inst_msg_avatar.set_texture(pdata.texture||PIXI.Texture.WHITE)
	},

	card_down(card_id) {

		const card=objects.mini_cards[card_id]
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dlg(card.uid)
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id)

	},

	show_table_dialog(card_id) {


		//если какая-то анимация или открыт диалог
		if (anim3.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};

		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();

		anim3.add(objects.td_cont, {x: [800, objects.td_cont.sx, 'linear']}, true, 0.1);

		const card=objects.mini_cards[card_id];

		objects.td_cont.card=card;

		objects.td_avatar1.set_texture(players_cache[card.uid1].texture);
		objects.td_avatar2.set_texture(players_cache[card.uid2].texture);

		objects.td_rating1.text = card.rating_text1.text;
		objects.td_rating2.text = card.rating_text2.text;

		objects.td_name1.set2(card.name1, 220);
		objects.td_name2.set2(card.name2, 220);

	},

	close_table_dialog() {
		
		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		
		sound.play('close_it')
		anim3.add(objects.td_cont, {x: [objects.td_cont.x, 800, 'linear']}, false, 0.1);
	},

	show_invite_dlg(uid) {

		//если какая-то анимация или уже сделали запрос
		if (anim3.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};

		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');

		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_btn.texture=assets.invite_btn;

		anim3.add(objects.invite_cont, {x: [800, objects.invite_cont.sx, 'linear']}, true, 0.15);

		//предварительные данные
		lobby.opp_uid=uid
		const opp_data=players_cache[uid]


		this.show_feedbacks(uid);

		let invite_available=uid !== my_data.uid;
		invite_available=invite_available || lobby.opp_uid==='bot';
		invite_available=invite_available && opp_data.rating >= 50 && my_data.rating >= 50;

		//на моей карточке показываем стастику
		if(lobby.opp_uid===my_data.uid){
			objects.invite_my_stat.text=[`Рейтинг: ${my_data.rating}\nИгры: ${my_data.games}`,`Rating: ${my_data.rating}\nGames: ${my_data.games}`][LANG]
			objects.invite_my_stat.visible=true;
		}else{
			objects.invite_my_stat.visible=false;
		}

		//кнопка удаления комментариев
		objects.fb_delete_btn.visible=my_data.uid===lobby.opp_uid;

		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby.opp_uid] && Date.now()-this.rejected_invites[lobby.opp_uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_btn.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.set_texture(opp_data.texture)
		objects.invite_name.set2(opp_data.name,230)
		objects.invite_rating.text=opp_data.rating

	},

	fb_delete_down(){

		return
		
		objects.fb_delete_btn.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);

		pmsg.add({t:['Отзывы удалены','Feedbacks are removed'][LANG]})

	},

	async show_invite_dlg_from_chat(uid) {

		if (anim3.any_on() || pending_player!=='') return
		this.show_invite_dlg(uid)
		
	},

	async show_feedbacks(uid) {

		//получаем фидбэки сначала из кэша, если их там нет или они слишком старые то загружаем из фб
		let fb_obj;
		if (!this.fb_cache[uid] || (Date.now()-this.fb_cache[uid].tm)>120000) {

			fb_obj =await my_ws.get('fb/' + uid)

			//сохраняем в кэше отзывов
			this.fb_cache[uid]={}
			this.fb_cache[uid].tm=Date.now()
			if (fb_obj){
				this.fb_cache[uid].fb_obj=fb_obj;
			}else{
				fb_obj=[{nofb:1}];
				this.fb_cache[uid].fb_obj=fb_obj;
			}

			//console.log('загрузили фидбэки в кэш')

		} else {
			fb_obj =this.fb_cache[uid].fb_obj;
			//console.log('фидбэки из кэша ,ура')
		}

		//сортируем отзывы по дате
		fb_obj.sort(function(a,b) {
			return b.tm-a.tm
		});

		//сначала убираем все фидбэки
		objects.feedback_records.forEach(fb=>fb.visible=false)

		let prv_fb_bottom=0;
		const fb_cnt=Math.min(fb_obj.length,objects.feedback_records.length);
		for (let i = 0 ; i < fb_cnt;i++) {
			const fb_place=objects.feedback_records[i];

			//устанаваем отзыв
			fb_place.set(fb_obj[i])

			const fb_height=fb_place.text.textHeight*0.95
			const fb_end=prv_fb_bottom+fb_height

			//если отзыв будет выходить за экран то больше ничего не отображаем
			const fb_end_abs=fb_end+objects.invite_cont.y+objects.invite_feedback.y
			if (fb_end_abs>450) return;

			fb_place.visible=true
			fb_place.y=prv_fb_bottom
			prv_fb_bottom+=fb_height
		}
	},

	async close() {

		if (objects.invite_cont.visible) this.close_invite_dialog()
		if (objects.td_cont.visible) this.close_table_dialog()
		if (objects.pref_cont.visible) pref.close()		

		//плавно все убираем
		anim3.add(objects.cards_cont, {alpha: [1, 0, 'linear']}, false, 0.1)
		anim3.add(objects.lobby_footer_cont, {y: [ objects.lobby_footer_cont.y, 450, 'linear']}, false, 0.2)
		anim3.add(objects.lobby_header_cont, {y: [objects.lobby_header_cont.y, -50, 'linear']}, false, 0.2)

		//больше ни ждем ответ ни от кого
		pending_player=''
		this.on=0

		//отписываемся от изменений состояний пользователей через 30 секунд
		this.state_listener_timeout=setTimeout(()=>{
			this.disconnect();
		},30000);

	},

	disconnect(){
		console.log('lobby disconnected')
		this.global_players={}
		if(ROOM_NAME) fbs.ref(ROOM_NAME).off()
		this.state_listener_on=0
	},

	connect(){

		console.log('lobby connected');
		fbs.ref(ROOM_NAME).on('child_changed', s => {
			const val=s.val()
			this.global_players[s.key]=val
			lobby.players_list_updated(this.global_players)
		});
		fbs.ref(ROOM_NAME).on('child_added', s => {
			const val=s.val()
			this.global_players[s.key]=val
			lobby.players_list_updated(this.global_players)
		});
		fbs.ref(ROOM_NAME).on('child_removed', s => {
			const val=s.val()
			delete this.global_players[s.key]
			lobby.players_list_updated(this.global_players)
		});

		fbs.ref(ROOM_NAME+'/'+my_data.uid).onDisconnect().remove()
		this.state_listener_on=1

	},
	
	change_room(new_room){
		
		this.disconnect()
		if(ROOM_NAME)
			fbs.ref(ROOM_NAME+'/'+my_data.uid).remove()
		ROOM_NAME=new_room
		this.connect()
		
		//создаем заголовки
		const room_desc=['КОМНАТА #','ROOM #'][LANG]+ROOM_NAME.slice(6)
		objects.t_room_name.text=room_desc	

		set_state({state:'o'})
	},

	async inst_message(data){

		//когда ничего не видно не принимаем сообщения
		if(!objects.cards_cont.visible) return

		await players_cache.update(data.uid)

		sound.play('inst_msg')
		anim3.add(objects.inst_msg_cont, {alpha: [0, 1, 'linear']}, true, 0.4, false)
		objects.inst_msg_avatar.texture=players_cache[data.uid].texture||PIXI.Texture.WHITE
		objects.inst_msg_text.set2(data.msg,290)
		objects.inst_msg_cont.tm=Date.now()
		
		clearTimeout(objects.inst_msg_cont.close_timer)
		objects.inst_msg_cont.close_timer=setTimeout(()=>{
			anim3.add(objects.inst_msg_cont, {alpha: [1, 0, 'linear']}, false, 0.4, false)
		},7000)
		
	},

	get_room_to_go(){
	
		return 'states'
		
		//московское время и ночная комната
		if (SERVER_TM){
			const msk_hour=+new Date(SERVER_TM).toLocaleString('en-US', {timeZone: 'Europe/Moscow',hour:'numeric',hourCycle:'h23'})
			if (msk_hour>=0&&msk_hour<6)
				return 'statesNIGHT'		
		}	
		
		//номер комнаты в зависимости от рейтинга игрока
		const rooms_bins=[0,1366,1437,1580,9999];
		for (let i=1;i<rooms_bins.length;i++){
			const f=rooms_bins[i-1];
			const t=rooms_bins[i];
			if (my_data.rating>f&&my_data.rating<=t)
				return 'states'+i
		}
		return 'states1'

	},

	peek_down(){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		this.close();

		//активируем просмотр игры
		game_watching.activate(objects.td_cont.card);
	},

	wheel_event(dir) {

	},

	close_invite_dialog() {

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		if (!objects.invite_cont.visible) return;
		
		sound.play('close_it')
		
		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim3.add(objects.invite_cont, {x: [objects.invite_cont.x, 800, 'linear']}, false, 0.15);
	},

	async send_invite() {


		if (!objects.invite_cont.ready||!objects.invite_cont.visible||objects.invite_btn.texture===assets.invite_wait_img){
			sound.play('locked');
			return
		};

		if (anim3.any_on()){
			sound.play('locked');
			return
		};


		if (lobby.opp_uid==='bot')
		{
			await this.close();	
			game.activate('master', bot_player );
		} else {
			sound.play('click');
			objects.invite_btn.texture=assets.invite_wait_img;
			fbs.ref('inbox/'+lobby.opp_uid).set({sender:my_data.uid,message:'INV',tm:Date.now()});
			pending_player=lobby.opp_uid;

		}

	},

	rejected_invite(msg) {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		this.close_invite_dialog();
		if(msg==='REJECT_ALL')
			big_msg.show({t1:['Соперник пока не принимает приглашения.','The opponent refused to play.'][LANG],t2:'---',t3:'',fb:0});
		else
			big_msg.show({t1:['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG],t2:'---',t3:'',fb:0});

	},

	async accepted_invite(seed) {

		//убираем запрос на игру если он открыт
		req_dialog.hide();

		//устанаваем окончательные данные оппонента
		opp_data.uid=lobby.opp_uid;

		//закрываем меню и начинаем игру
		//await lobby.close();
		game.activate('master',online_game);
		//game2.activate('master');


	},

	chat_btn_down(){
		
		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		//objects.lobby_btn_hl.x=objects.lobby_lb_btn.x;
		//objects.lobby_btn_hl.y=objects.lobby_lb_btn.y;
		//anim3.add(objects.lobby_btn_hl, {alpha: [0, 1, 'ease3peaks']}, false, 0.25, false);

		this.close();
		chat.activate();

	},

	bg_btn_down(){
		
		if (anim3.any_on()) {
			sound.play('locked')
			return
		}

		sound.play('click');

		this.close()
		trnm.activate()

	},

	async lb_btn_down() {

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_lb_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_lb_btn.y;
		anim3.add(objects.lobby_btn_hl, {alpha: [0, 1, 'ease3peaks']}, false, 0.25, false);


		await this.close();
		lb.show();
	},

	list_btn_down(dir){

		if (anim3.any_on()) {
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
		anim3.add(objects.lobby_btn_hl, {alpha: [0, 1, 'ease3peaks']}, false, 0.25, false);


		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}

		anim3.add(objects.cards_cont, {x: [cur_x, new_x, 'easeInOutCubic']}, true, 0.2);
	},

	async back_btn_down() {

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('close_it');

		await this.close();
		main_menu.activate();

	},

	info_btn_down(){


	},

	info_close_down(){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('close');

		anim3.add(objects.info_cont, {alpha: [1, 0, 'linear']}, false, 0.25);

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

	firebase.database().ref(ROOM_NAME+'/'+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id, game_id:game_id});

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

main_loader={

	divide_texture(t,frame_w,frame_h, names){
		
		const frames_x=Math.floor(t.width/frame_w)
		const frames_y=Math.floor(t.height/frame_h)
			
		if (typeof(names)==='string'){
			assets[names]=[]
			let i=0
			for (let y=0;y<frames_y;y++){
				for (let x=0;x<frames_x;x++){
					const rect=new PIXI.Rectangle(x*frame_w, y*frame_h, frame_w, frame_h)
					assets[names][i]=new PIXI.Texture(t.baseTexture, rect)
					i++
				}
			}			
		}else{
			
			let i=0
			for (let y=0;y<frames_y;y++){
				for (let x=0;x<frames_x;x++){
					const rect=new PIXI.Rectangle(x*frame_w, y*frame_h, frame_w, frame_h)
					assets[names[i]]=new PIXI.Texture(t.baseTexture, rect)
					i++
				}
			}			
		}
	},

	async load1(){

		document.getElementById("m_progress").style.display = 'flex';

		//подпапка с ресурсами
		let lang_pack = ['RUS','ENG'][LANG];

		git_src='https://akukamil.github.io/quoridor/'
		//git_src=''


		const loader=new PIXI.Loader();
		loader.add("m2_font", COM_URL+"/fonts/bahnschrift48/f.fnt");

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
		loader.add('online_msg',git_src+'sounds/online_msg.mp3');
		loader.add('gw_move',git_src+'sounds/gw_move.mp3');
			
		//добавляем текстуры стикеров
		for (let i=0;i<16;i++)
			loader.add("sticker_texture_"+i, git_src+"/stickers/"+i+".png");
		
		//добавляем из листа загрузки
		for (let i = 0; i < load_list.length; i++)
			if (load_list[i].class === "sprite" || load_list[i].class === "image" )
				loader.add(load_list[i].name, git_src+'res/'+lang_pack+'/'+load_list[i].name+"."+load_list[i].image_format);		

		loader.onProgress.add(l=>{
			document.getElementById("m_bar").style.width =  Math.round(l.progress)+"%";
		})
		
		await new Promise(r=> loader.load(r))
		
		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name]
			assets[res_name]=res.texture||res.sound||res.data;		
		}		
		
		this.divide_texture(assets.flame_pack,80,180,'flame')
		this.divide_texture(assets.chips_pack,80,80,'chips')
	
		
		//убираем элементы загрузки
		document.getElementById("m_progress").outerHTML='';

	}

}

async function init_game_env(lng) {
		
	await define_platform_and_language();
	console.log(game_platform, LANG);		
		
				
	//отображаем шкалу загрузки
	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;	}body {display: flex;align-items: center;justify-content: center;background-color: rgba(41,41,41,1);flex-direction: column	}#m_progress {	  background: #1a1a1a;	  justify-content: flex-start;	  border-radius: 5px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;	  border-radius: 5px;	  background: rgb(119, 119, 119);	  height: 70%;	  width: 0%;	}	</style></div><div id="m_progress">  <div id="m_bar"></div></div>';
				
	//ждем когда загрузятся ресурсы
	await main_loader.load1();

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
		objects.id_loup.x=20*Math.sin(TM.s*8)+100;
		objects.id_loup.y=20*Math.cos(TM.s*8)+130;
	}

	//запускаем главный цикл
	main_loop.start();

	//показыаем основное меню
	main_menu.activate();
	console.clear()
	
	//получаем данные об игроке из социальных сетей
	await auth2.init();		
		
	//получаем остальные данные об игроке
	let other_data = await fbs_once("players/"+my_data.uid)

	//делаем защиту от неопределенности
	my_data.rating = (other_data?.rating) || 1400;	
	my_data.games = (other_data?.games) || 0;
	my_data.name=other_data?.name || my_data.name;
	my_data.chip = (other_data?.chip) || 0;
	my_data.nick_tm = other_data?.nick_tm || 0;
	my_data.avatar_tm = other_data?.avatar_tm || 0;
	my_data.country = other_data?.country || await auth2.get_country_code() || await auth2.get_country_code2() 
	
	ROOM_NAME='states';
	
	//ии для бота
	bot_player.register_sw()
	
	//правильно определяем аватарку
	if (other_data?.pic_url && other_data.pic_url.includes('mavatar'))
		my_data.pic_url=other_data.pic_url
	else
		my_data.pic_url=my_data.orig_pic_url
	
	//добавляем страну к имени если ее нет
	if (!auth2.get_country_from_name(my_data.name)&&my_data.country)
		my_data.name=`${my_data.name} (${my_data.country})`
		
	//загружаем мои данные в кэш
	players_cache.update_params(my_data.uid,{pic_url:my_data.pic_url,rating:my_data.rating,country:my_data.country,name:my_data.name});
	await players_cache.update(my_data.uid);
	
	//устанавливаем фотки в попап
	objects.my_avatar.texture=players_cache[my_data.uid].texture;
	objects.id_avatar.texture=players_cache[my_data.uid].texture;
	objects.id_name.set2(my_data.name,150);		
		
	//отключение от игры и удаление не нужного
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(ROOM_NAME+'/'+my_data.uid).onDisconnect().remove();			

	//устанавливаем рейтинг в попап
	objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

	//обновляем почтовый ящик
	fbs.ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

	//подписываемся на новые сообщения
	fbs.ref("inbox/"+my_data.uid).on('value', s => { process_new_message(s.val())})

	//обновляем данные в файербейс так как могли поменяться имя или фото
	fbs.ref('players/'+my_data.uid).set({
		name:my_data.name,
		country:my_data.country,
		pic_url: my_data.pic_url,
		rating : my_data.rating,
		chip : my_data.chip,
		nick_tm:my_data.nick_tm,
		avatar_tm:my_data.avatar_tm,
		games:my_data.games,
		tm:firebase.database.ServerValue.TIMESTAMP
	});

	//сообщение для дубликатов
	client_id = irnd(10,999999);
	fbs.ref('inbox/'+my_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id});

	//устанавливаем мой статус в онлайн
	set_state({state : 'o'});
	
	//это событие когда меняется видимость приложения
	document.addEventListener("visibilitychange", vis_change);

	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);

	
	await my_ws.init();
	
	SERVER_TM||=await my_ws.get_tms()
	
	//ждем загрузки чата
	await chat.init();	

	//ждем и убираем попап
	await new Promise(r => setTimeout(r, 500));
	
	anim3.add(objects.id_cont,{y:[objects.id_cont.y, -200,'easeInBack']}, false, 0.25);
	
	some_process.loup_anim=function() {}
		
	//событие ролика мыши в карточном меню
	window.addEventListener('keydown',function(event){keyboard.keydown(event.key)});	
	window.addEventListener('wheel', (event) => {chat.wheel_event(Math.sign(event.deltaY))}, {passive: false});	
		
	//контроль за присутсвием
	const connected_control = firebase.database().ref('.info/connected');
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

main_loop={
	

	lastTime:0,	
	
	start(fps){
	
		TM.ms = 0
		TM.s=0
		this.run(TM.ms)
		
	},
	
	run(t){		
		
		const delta = t - this.lastTime							
		const cap_delta = Math.min(delta,16.666)	
					
		TM.ms=t
		TM.s=TM.ms*0.001					
					
		anim3.process()

		//обрабатываем минипроцессы
		for (const key in some_process)
			some_process[key](cap_delta)

		app.renderer.render(app.stage)			
		
		this.lastTime = t
		requestAnimationFrame(main_loop.run.bind(this))	
		
	}	
	
}
