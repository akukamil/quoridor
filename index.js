var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}, state="",my_role="", LANG = 1, game_tick=0, my_turn=0, game_id=0, h_state=0, made_moves=0, game_platform="", hidden_state_start = 0, connected = 1;
var players="", pending_player="";
var my_data={opp_id : ''},opp_data={};
var some_process = {};
const V_WALL = 2, H_WALL = 1, ROW0 = 0, ROW8 = 8, MY_ID = 1, OPP_ID = 2, MAX_MOVES = 25, FIELD_MARGIN = 20;
var WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;

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

var message =  {
	
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

var anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
    easeOutBounce: function (x) {
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
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI);
	},
	
	easeInOutCubic: function(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		if (anim3_origin === undefined)
			anim3.kill_anim(obj);


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
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					

					

				this.slot[i] = {
					obj: obj,
					params: params,
					vis_on_end: vis_on_end,
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
	
	process: function () {
		
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
		
	}
	
}

var anim3 = {
			
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	add : function (obj, params, schedule, func = 0, repeat = 0) {
		
		//anim3.add(objects.header0,['x','y'],[{time:0,val:[0,0]},{time:1,val:[110,110]},{time:2,val:[0,0]}],'easeInOutCubic');	
		
		
		//если уже идет анимация данного спрайта то отменяем ее
		anim3.kill_anim(obj);
		
		
		//ищем свободный слот для анимации
		let f=0;
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {
				
				obj.ready = true;
				
				//если это точечная анимация то сразу устанавливаем первую точку
				if (func === 0)
					for (let i=0;i<params.length;i++)
						obj[params[i]]=schedule[0].val[i]
				
				this.slot[i] = {
					obj: obj,
					params: params,
					schedule: schedule,
					func: func,
					start_time : game_tick,
					cur_point: 0,
					next_point: 1,
					repeat: repeat
				};
				f = 1;				
				break;
			}
		}		
		
		if (f===1) {			
			return new Promise(function(resolve, reject){					
			  anim3.slot[i].p_resolve = resolve;	  		  
			});				
		} else {
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
	},
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				//это точечная анимация
				if (s.func === 0) {
					
					let time_passed = game_tick - s.start_time;
					let next_point_time = s.schedule[s.next_point].time;
					
					//если пришло время следующей точки
					if (time_passed > next_point_time) {
						
						//устанавливаем параметры точки
						for (let i=0;i<s.params.length;i++)
							s.obj[s.params[i]]=s.schedule[s.next_point].val[i];
												
						s.next_point++;		
						
						//начинаем опять отчет времени
						s.start_time = game_tick;	
						
						//если следующая точка - не существует
						if (s.next_point === s.schedule.length) {							

							if (s.repeat === 1) {
								s.start_time = game_tick
								s.next_point = 1;
							}
							else {								
								s.p_resolve('finished');
								this.slot[i]=null;									
							}
						
						}
					}					
				}
				else
				{
					//это вариант с твинами между контрольными точками
					
					m_lable : if (s.obj.ready === true) {						
						
						//если больше нет контрольных точек то убираем слот или начинаем сначала
						if (s.next_point === s.schedule.length) {
							
							if (s.repeat === 1) {
								s.cur_point = 0;
								s.next_point = 1;
							}
							else {
								s.p_resolve('finished');
								this.slot[i]=null;	
								break m_lable;
							}			
						}					

							
						let p0 = s.schedule[s.cur_point];
						let p1 = s.schedule[s.next_point];
						let time = p1.time;
						
						//заполняем расписание для анимации №2
						let cur_schedule={};							
						for (let i = 0 ; i < s.params.length ; i++) {						
							let p = s.params[i];
							cur_schedule[p]=[p0.val[i],p1.val[i]]						
						}					
						
						//активируем анимацию
						anim2.add(s.obj,cur_schedule,true,time,s.func,1);	
						
						s.cur_point++;
						s.next_point++;							
							
					
					}		
				}
			}			
		}		
	}
	

}

var big_message = {
	
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

var make_text = function (obj, text, max_width) {

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

var online_game = {
		
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

	},
	
	init : function (r) {
		
		this.me_conf_play = 0;
		this.opp_conf_play = 0;
		
		
		if (state === 'b') {
			
			
			
		}
		

		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'p'});
			

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
			['my_timeout',LOSE, 'Вы проиграли!\nУ вас закончилось время'],
			['opp_timeout',WIN , 'Вы выиграли!\nУ соперника закончилось время'],
			['my_giveup' ,LOSE, 'Вы сдались!'],
			['opp_giveup' ,WIN , 'Вы выиграли!\nСоперник сдался'],
			['both_finished',DRAW, 'Ничья'],
			['my_finished_first',WIN , 'Вы выиграли!\nБыстрее соперника добрались до цели'],
			['opp_finished_first',LOSE, 'Вы проиграли!\nСоперник оказался быстрее вас.'],
			['my_closer_after_80',WIN , 'Вы выиграли!\nВы оказались ближе к цели.'],
			['opp_closer_after_80',LOSE, 'Вы проиграли!\nСоперник оказался ближе к цели.'],
			['both_closer_80',DRAW , 'Ничья\nОба на одинаковом расстоянии до цели'],
			['my_no_sync',NOSYNC , 'Похоже вы не захотели начинать игру.'],
			['opp_no_sync',NOSYNC , 'Похоже соперник не смог начать игру.'],
			['my_no_connection',LOSE , 'Потеряна связь!\nИспользуйте надежное интернет соединение.']
		];
					
		
		clearTimeout(this.timer_id);		
		
		let result_row = res_array.find( p => p[0] === result);
		let result_str = result_row[0];
		let result_number = result_row[1];
		let result_info = result_row[2];				
		let old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, result_number);
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
	
						
		//убираем элементы
		objects.timer.visible = false;
		
		//убираем кнопки
		objects.game_buttons_cont.visible = false;
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC )
			game_res.resources.lose.sound.play();
		else
			game_res.resources.win.sound.play();
				

		//если игра результативна то записываем дополнительные данные
		if (result_number === DRAW || result_number === LOSE || result_number === WIN) {
			
			//увеличиваем количество игр
			my_data.games++;
			firebase.database().ref("players/"+[my_data.uid]+"/games").set(my_data.games);		

			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			firebase.database().ref("finishes/"+game_id).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result_str,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			
		}
		
		await big_message.show(result_info, `Рейтинг: ${old_rating} > ${my_data.rating}`)
	
	}

};

var bot_player = {
	
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
					
		game.receive_move(best_child.move_data);
		
	},
	
	init : function () {
		
		this.pending_stop
		
		set_state({state : 'b'});	

		//показываем кнопку стоп
		objects.stop_bot_button.visible = true;
		
		//отключаем таймер...........................
		objects.timer.text  = 'Я хожу'
	},
	
	stop : async function (result) {
		
		let res_array = [
			['my_stop' ,DRAW, 'Вы отменили игру!'],
			['both_finished',DRAW, 'Ничья'],
			['my_finished_first',WIN , 'Вы выиграли!\nБыстрее соперника добрались до цели'],
			['opp_finished_first',LOSE, 'Вы проиграли!\nСоперник оказался быстрее вас.'],
			['my_closer_after_80',WIN , 'Вы выиграли!\nВы оказались ближе к цели.'],
			['opp_closer_after_80',LOSE, 'Вы проиграли!\nСоперник оказался ближе к цели.'],
			['both_closer_80',DRAW , 'Ничья\nОба на одинаковом расстоянии до цели']
		];
						
		this.no_incoming_move = 1;
		
		let result_number = res_array.find( p => p[0] === result)[1];
		let result_info = res_array.find( p => p[0] === result)[2];				
			
		//выключаем элементы
		objects.timer.visible = false;

		//убираем кнопку стоп
		objects.stop_bot_button.visible=false;
		
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			game_res.resources.lose.sound.play();
		else
			game_res.resources.win.sound.play();		
		
		await big_message.show(result_info, 'Сыграйте с реальным соперником для получения рейтинга')
	
	},
	
	silent_stop : function() {
		
		
		//убираем кнопку стоп
		objects.stop_bot_button.visible=false;
		
		
	},
	
	reset_timer : function() {
		
		
	},
	
	start_mm_search : async function(node) {
		
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

var mcts = {	

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

var ffunc = {
	
	blocked_way : function (field, r, c, tar_row, init) {
		
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
		
	init : function (field) {
		
		
		//создаем поле
		field.f = [];
		field.pos = {};
		
		
		//очищаем поле
		for (let r = 0; r < 9; r++ ) {
			field.f.push([{},{},{},{},{},{},{},{},{}]);
			
			for (let c = 0; c < 9; c++ ) {				
				field.f[r][c].wall_type = 0;	
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
	
	make_move (field, r0, c0, r1, c1) {
		
		
		let player_id = field.f[r0][c0].player;		

		field.f[r0][c0].player = 0;		
		field.f[r1][c1].player = player_id;
		
		field.pos[player_id].r = r1;
		field.pos[player_id].c = c1;


	},
	
	draw : function(field) {
		
		let wall_iter = 0;
				
		//убираем все стены
		objects.walls.forEach(w=>w.visible = false);
		objects.walls_cont.visible = true;
		
		//сначала рисуем стены
		for (let r = 0; r < 9; r++ ) {
			for (let c = 0; c < 9; c++ ) {	
				
				let cell = field.f[r][c];
				
				if (cell.wall_type === V_WALL) {					
					objects.walls[wall_iter].x = objects.field.x + FIELD_MARGIN + c * 50;
					objects.walls[wall_iter].y = objects.field.y + FIELD_MARGIN + r * 50;
					
					
					if (r === 1)
						objects.walls[wall_iter].texture=gres.v_wall_t.texture;
					else if (r === 8)
						objects.walls[wall_iter].texture=gres.v_wall_b.texture;
					else
						objects.walls[wall_iter].texture=gres.v_wall.texture;
					
					
					objects.walls[wall_iter].visible = true;
					wall_iter++;
				}
				
				if (cell.wall_type === H_WALL) {					
					objects.walls[wall_iter].x = objects.field.x + FIELD_MARGIN + c * 50;
					objects.walls[wall_iter].y = objects.field.y + FIELD_MARGIN + r * 50;
					
					if (c === 1)
						objects.walls[wall_iter].texture=gres.h_wall_l.texture;
					else if (c === 8)
						objects.walls[wall_iter].texture=gres.h_wall_r.texture;
					else
						objects.walls[wall_iter].texture=gres.h_wall.texture;
					
					objects.walls[wall_iter].visible = true;
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
	
	check_if_wall_block : function(field, wr, wc, wtype) {
		
		field.f[wr][wc].wall_type = wtype;
		
		if (this.blocked_way(field, field.pos[OPP_ID].r, field.pos[OPP_ID].c, ROW8, 1) === 1) {
			field.f[wr][wc].wall_type = 0;
			console.log('blocked opp');
			return 1;			
		}
		
		if (this.blocked_way(field, field.pos[MY_ID].r, field.pos[MY_ID].c, ROW0, 1) === 1) {
			field.f[wr][wc].wall_type = 0;
			console.log('blocked me');
			return 1;			
		}
		
		field.f[wr][wc].wall_type = 0;
		return 0;
		
	},
	
	get_random_wall_with_block_check : function ( field, player_id ) {
		
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
	
	get_random_wall : function ( field, player_id ) {
		
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
		
	check_new_wall : function (field, r, c, wall_type) {
		
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
	
	get_moves : function (field, PLAYER_ID) {
		
		
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
	
	get_simple_moves_for_bfs : function (field, r, c) {
		
		

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
			
	get_random_move : function(field, player_id) {
				
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
	
	get_walls_num : function (field) {
		
		let walls_num = 0 ;
		for (let r = 0; r < 9; r++ ) {
			
			for (let c = 0; c < 9; c++ ) {
				
				if (field.f[r][c].wall_type >0)
					walls_num++;
				
			}				
			
		}
		
		return walls_num;

		
	},
	
	get_players_num : function (field) {
		
		let walls_num = 0 ;
		for (let r = 0; r < 9; r++ ) {
			
			for (let c = 0; c < 9; c++ ) {
				
				if (field.f[r][c].player >0)
					walls_num++;
				
			}				
			
		}
		
		return walls_num;

		
	},
	
	perform_random_move : function(field, player_id) {
		
		
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
	
	get_winner : function (field) {
		
			
		if ( field.pos[MY_ID].r === ROW0 && field.pos[OPP_ID].r !== ROW8 )
			return MY_ID;			
		if ( field.pos[MY_ID].r === ROW0 && field.pos[OPP_ID].r === ROW8 )
			return 0;				
		if (field.pos[MY_ID].r !== ROW0 && field.pos[OPP_ID].r === ROW8)
			return OPP_ID;		
		
		return 3;
				
	},
	
	check_move :  {
		
		left : function(field, r, c) {
			
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
		
		right : function(field, r, c) {			

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
		
		up : function(field, r, c) {
			
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
		
		down : function(field, r, c) {
			
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
		
		up_jump : function(field, r, c) {
			
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
		
		down_jump : function(field, r, c) {
			
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
		
		left_jump : function(field, r, c) {
			
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
		
		right_jump : function(field, r, c) {
			
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
						
		up_left : function(field, r, c) {
			
			let tr = r - 1;			
			let tc = c - 1;
			
			if (tc < 0)	return 0;		
			if (tr < 0)	return 0;	
			
			//если впереди нет игрока то нельзя так ходить
			if (field.f[tr][c].player === 0)
				return 0;					
			
			if (field.f[r][c].wall_type === V_WALL)
				return 0;	
			
			if (field.f[r - 1][c].wall_type === V_WALL)
				return 0;	
			
			if (r < 8 && field.f[r + 1][c].wall_type === V_WALL)
				return 0;	
			
			if (field.f[r][c].wall_type === H_WALL)
				return 0;
			
			if (c < 8 && field.f[r][c + 1].wall_type === H_WALL)
				return 0;
						
			return 1;		
		},
		
		up_right : function(field, r, c) {
			
			let tr = r - 1;			
			let tc = c + 1;
			
			if (tc > 8)	return 0;		
			if (tr < 0)	return 0;	
			
			//если впереди нет игрока то нельзя так ходить
			if (field.f[tr][c].player === 0)
				return 0;					
			
			if (field.f[r][c + 1].wall_type === V_WALL)
				return 0;	
			
			if (field.f[r - 1][c + 1].wall_type === V_WALL)
				return 0;	
			
			if (r < 8 && field.f[r + 1][c + 1].wall_type === V_WALL)
				return 0;	
			
			if (field.f[r][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;			
		},	

		down_left : function(field, r, c) {
			
			let tr = r + 1;			
			let tc = c - 1;
			
			if (tc < 0)	return 0;		
			if (tr > 8)	return 0;	
			
			//если впереди нет игрока то нельзя так ходить
			if (field.f[tr][c].player === 0)
				return 0;					
			
			if (field.f[r][c].wall_type === V_WALL)
				return 0;	
			
			if (field.f[r +1][c].wall_type === V_WALL)
				return 0;	
			
			if (r < 7 && field.f[r + 2][c].wall_type === V_WALL)
				return 0;	
			
			if (field.f[r + 1][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r + 1][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;			
		},		

		down_right : function(field, r, c) {
			
			let tr = r + 1;			
			let tc = c + 1;
			
			if (tc > 8)	return 0;		
			if (tr > 8)	return 0;	
			
			//если впереди нет игрока то нельзя так ходить
			if (field.f[tr][c].player === 0)
				return 0;					
			
			if (field.f[r + 1][c + 1].wall_type === V_WALL)
				return 0;	
			
			if (field.f[r + 1][c + 1].wall_type === V_WALL)
				return 0;	
			
			if (r < 7 && field.f[r + 2][c + 1].wall_type === V_WALL)
				return 0;	
			
			if (field.f[r + 1][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r + 1][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;			
		},			
			
		left_w : function(field, r, c) {
							
			let tr = r;			
			let tc = c - 1;
			
			if (tc < 0)	return 0;			
									
			if (field.f[r][c].wall_type === V_WALL)
				return 0;	
			
			if (tr < 8 && field.f[tr+1][c].wall_type === V_WALL)
				return 0;
			
			return 1;
		},
		
		right_w : function(field, r, c) {			

			let tr = r;			
			let tc = c + 1;

			if (tc > 8)	return 0;	
			
			
			if (field.f[tr][tc].wall_type === V_WALL)
				return 0;	
			
			if (tr < 8 && field.f[tr+1][tc].wall_type === V_WALL)
				return 0;
			
			return 1;
			
		},
	
		up_w : function(field, r, c) {
			
			let tr = r - 1;			
			let tc = c;

			if (tr < 0)	return 0;	
			
			if (field.f[r][c].wall_type === H_WALL)
				return 0;	
			
			if (c < 8 && field.f[r][c + 1].wall_type === H_WALL)
				return 0;
			
			return 1;
			
		},
		
		down_w : function(field, r, c) {
			
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
	
	get_shortest_distance_to_target : function (field, player_id, target_row) {
		
		
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

var game = {
	
	opponent : {},
	selected : null,
	sel_cell :{},
	sel_cell_wall_iter : [0,0],
	field : {},
	pending_wall : {},
	pending_field :{},
	av_moves: [],
	
	activate: async function(role, opponent) {
					
		//если это переход из бот игры
		if (state === 'b') {
			this.opponent.silent_stop();
		}
						
				
		my_role=role;
		this.opponent = opponent;
		
		if (my_role === 'master') {
			my_turn = 1;			
			objects.timer.x=80;			
		} else {
			my_turn = 0;			
			objects.timer.x=720;			
		}
		
				
		//инициируем все что связано с оппонентом
		this.opponent.init(my_role);
				
		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
				
		//воспроизводим звук о начале игры
		gres.game_start.sound.play();
				
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
		objects.cur_move_text.text="Ход: "+made_moves;
				
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
		
	stop : async function (result) {
						
		//отключаем взаимодейтсвие с доской
		objects.field.pointerdown = function() {};
		
		//отключаем процессинги
		some_process.player_selected_processing = function(){};
		some_process.wall_processing = function(){};	


		//включаем запрет входящих ходов - это также остановит расчет бота если он идет
		this.opponent.no_incoming_move = 1;
				
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
		objects.move_buttons_cont.visible = false;
		objects.cur_move_text.visible = false;
		
		//убираем ходы если они остались
		this.show_my_moves(0);
				
		opp_data.uid = '';
						
		//показыаем рекламу		
		await show_ad();
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'o'});		
		
		main_menu.activate();
		
		//показываем социальную панель
		if (game_platform === 'VK')
			if (Math.random()>-0.75)
				social_dialog.show();		
	},
	
	mouse_down : async function(e) {
		
		if (my_turn === 0) {
			message.add(['Не твоя очередь','Not you turn'][LANG])
			return;
		}
		
		if (objects.big_message_cont.visible === true)
			return;
		
		//координаты указателя
		let mx = e.data.global.x/app.stage.scale.x;
		let my = e.data.global.y/app.stage.scale.y;

		//координаты указателя на игровой доске
		let _c = Math.floor(9*(mx-objects.field.x-FIELD_MARGIN)/450);
		let _r = Math.floor(9*(my-objects.field.y-FIELD_MARGIN)/450);
		let _id = _c + _r * 8;
		let p = this.field.pos[MY_ID]; p ={r:p.r, c:p.c};
		
		let player_cell_selected = (p.r === _r && p.c === _c);

		
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
			let wall_ok = this.show_wall_opt(_id);
			if (wall_ok === 1) {
				objects.move_buttons_cont.visible = true;				
				some_process.wall_processing=this.wall_processing;	
			}

		}		
	
	},
	
	player_selected_processing : function() {
		
		objects.my_icon.alpha = Math.abs(Math.sin(game_tick * 5));
		
	},
	
	wall_processing : function() {
		
		if (objects.h_wall.visible === true)
			objects.h_wall.alpha = Math.abs(Math.sin(game_tick * 5));
		if (objects.v_wall.visible === true)
			objects.v_wall.alpha = Math.abs(Math.sin(game_tick * 5));
	},
	
	update_player_pos : async function (sprite, r1, c1, r2, c2) {
		
		let x1 = objects.field.x + FIELD_MARGIN + c1 * 50;
		let y1 = objects.field.y + FIELD_MARGIN + r1 * 50;
		let x2 = objects.field.x + FIELD_MARGIN + c2 * 50;
		let y2 = objects.field.y + FIELD_MARGIN + r2 * 50;
					
		await anim2.add(sprite,{x:[x1, x2],y:[y1,y2]}, true, 0.25,'linear');
		sprite.alpha = 1;
		
	},
	
	confirm_move : function () {
		
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
		
		game_res.resources.place_wall.sound.play();
		this.field.f[pw.r][pw.c].wall_type = pw.wall_type;
		
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
	
	get_game_state : function () {
		
			
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
	
	decline_move : function () {
		
		
		//воспроизводим звук
		game_res.resources.cancel_wall.sound.play();
		
		this.stop_wall_processing();
		
	},
	
	stop_wall_processing : function () {
		
		objects.h_wall.visible = false;
		objects.v_wall.visible = false;
		this.sel_cell_wall_iter = [0,0];
		objects.move_buttons_cont.visible = false;
		some_process.wall_processing = function(){};
	},
			
	show_wall_opt : function (id) {
		
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
					
					if (r === 1)
						w_spr.texture=gres.v_wall_t.texture;
					else if (r === 8)
						w_spr.texture=gres.v_wall_b.texture;
					else
						w_sprtexture=gres.v_wall.texture;					
				}
				
				if (wp[0] === H_WALL) {
					
					w_spr = objects.h_wall;
					
					if (c === 1)
						w_spr.texture=gres.h_wall_l.texture;
					else if (c === 8)
						w_spr.texture=gres.h_wall_r.texture;
					else
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
			
	show_my_moves : function(show) {
				
		if (show===0) {
			objects.move_opt_cont.visible=false;
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
	
	receive_move : async function (data) {
		
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
			this.field.f[data.r][data.c].wall_type = data.wall_type;
			
			//обновляем кол-во стен
			this.field.pos[OPP_ID].walls--;
			objects.opp_walls.text = 'Стены: ' + this.field.pos[OPP_ID].walls;
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

var rating = {
	
	update : function (game_result_for_player) {
		
		if (game_result_for_player === 999)
			return '';
								
		//обновляем мой рейтинг в базе и на карточке
		let my_old_rating = my_data.rating;
		let my_new_rating = this.calc_my_new_rating(game_result_for_player);
		let my_rating_change = my_new_rating - my_old_rating;
		let opp_new_rating = opp_data.rating - my_rating_change;
		
		
		my_data.rating = my_new_rating;
		objects.my_card_rating.text = my_data.rating;
		my_data.games++;
				
		//записываем в базу свой новый рейтинг и оппонента
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
		firebase.database().ref("players/"+my_data.uid+"/games").set(my_data.games);			
		firebase.database().ref("players/"+opp_data.uid+"/rating").set(opp_new_rating);		


		return 'Рейтинг: ' + my_old_rating + ' > ' + my_new_rating;		
		
	},
	
	calc_my_new_rating : function(res)	{

		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (res===1)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (res===0)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (res===-1)
			return Math.round(my_data.rating + 16 * (0 - Ea));
	
	}	
	
}

var keep_alive = function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref("states/"+my_data.uid).remove();
		return;		
	}


	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref("states/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var process_new_message = function(msg) {

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
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender===opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}
}

var req_dialog = {
	
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
				anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 1,'easeOutElastic');

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

		if (objects.req_cont.ready===false)
			return;
		
		//только когда бот сделал ход
		if (state ==='b' && my_turn === 0)
			return;
				
		gres.click.sound.play();
		
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 1,'easeInBack');

				
		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*299);
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

var	show_ad = async function(){
		
	if (game_platform==="YANDEX") {				
		await new Promise((resolve, reject) => {			
			window.ysdk.adv.showFullscreenAdv({  callbacks: {onClose: function() {resolve}, onError: function() {resolve}}});			
		});		
	}
	
	if (game_platform==="VK")
		await vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"});
	
}

var social_dialog = {
	
	show : function() {
		
		anim2.add(objects.social_cont,{x:[800,objects.social_cont.sx]}, true, 0.06,'linear');
		
		
	},
	
	invite_down : function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		vkBridge.send('VKWebAppShowInviteBox');
		social_dialog.close();
		
	},
	
	share_down: function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		vkBridge.send('VKWebAppShowWallPostBox', {"message": `Мой рейтинг в игре Балда ${my_data.rating}. Сможешь победить меня?`,
		"attachments": "https://vk.com/app8044184"});
		social_dialog.close();
	},
	
	close_down: function() {
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		social_dialog.close();
	},
	
	close : function() {
		
		anim2.add(objects.social_cont,{x:[objects.social_cont.x,800]}, false, 0.06,'linear');
				
	}
	
}

var stickers={
	
	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel: function() {



		if (objects.stickers_cont.ready===false)
			return;
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

		if (objects.stickers_cont.ready===false)
			return;
		
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
		//game_res.resources.receive_sticker.sound.play();

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

var main_menu = {

	logo_dx : 0.2,
	
	activate: function() {


		

		//просто добавляем контейнер с кнопками
		objects.desktop.texture=gres.desktop.texture;
		objects.desktop.visible = true;
		anim2.add(objects.tile,{alpha: [0,0.3]}, true, 1,'linear');
		
		//anim2.add(objects.maze_logo_top,{alpha: [0,1]}, true, 1,'easeInOutCubic');
		anim2.add(objects.maze_logo,{alpha: [0,1]}, true, 3,'linear');
		anim2.add(objects.main_buttons_cont,{y:[450, objects.main_buttons_cont.sy],alpha: [0,1]}, true, 1,'linear');
		
		some_process.maze_logo_move = this.process.bind(this);

	},	

	close : async function() {


		
		//anim2.add(objects.maze_logo_top,{alpha: [1,0]}, false, 1,'easeInOutCubic');
		anim2.add(objects.maze_logo,{alpha: [1,0]}, false, 1,'linear');
		anim2.add(objects.main_buttons_cont,{y:[ objects.main_buttons_cont.y, 450],alpha: [1,0]}, true, 1,'linear');
		await anim2.add(objects.tile,{alpha: [0.3,0]}, false, 1,'linear');
		some_process.maze_logo_move = function(){};

	},

	play_button_down: async function () {

		game_res.resources.click.sound.play();

		await this.close();
		cards_menu.activate();

	},

	lb_button_down: function () {

		if (any_dialog_active===1) {
			gres.locked.sound.play();
			return
		};

		gres.click.sound.play();

		this.close();
		lb.show();

	},

	rules_button_down: function () {

		if (any_dialog_active===1) {
			gres.locked.sound.play();
			return
		};

		gres.click.sound.play();

	
		anim2.add(objects.rules_cont,{y:[-450, objects.rules_cont.sy]}, true, 1,'easeOutBack');

	},

	rules_ok_down: function () {
		any_dialog_active=0;		
		anim2.add(objects.rules_cont,{y:[objects.rules_cont.y,-450, ]}, false, 1,'easeInBack');
	},
	
	process : function () {
		
		//objects.tile.tileScale.x = objects.tile.tileScale.y = 2 + Math.sin(game_tick * 0.2);

		objects.tile.tilePosition.x += Math.sin(game_tick * 0.2)*2;
		objects.tile.tilePosition.y += Math.cos(game_tick * 0.3)*2;

	}

}

var lb = {

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;
		objects.lb_header6.visible=true;
		
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
		objects.lb_header6.visible=false;

	},

	back_button_down: function() {

		if (any_dialog_active===1 || objects.lb_1_cont.ready===false) {
			gres.locked.sound.play();
			return
		};


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

var cards_menu = {

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
		objects.back_button.visible=true;


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
		firebase.database().ref("states") .on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});

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
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
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
		if (num_of_cards > 14)
			num_of_tables = num_of_tables - (num_of_cards - 14);

		
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
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2});
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

	place_table : function (params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400}) {
				
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
					resolve('https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg');
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

		objects.mini_cards[0].bcg.tint=0x555555;
		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="AI";
		objects.mini_cards[0].name="Бот";
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
		
		if (objects.td_cont.ready === false || objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			gres.locked.sound.play();
			return
		};


		gres.click.sound.play();
		
		anim2.add(objects.td_cont,{y:[-150,objects.td_cont.sy]}, true, 0.5,'easeOutBack');
		
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
		objects.invite_header6.text = ['Пригласить','Ask to play'][LANG];

	
		anim2.add(objects.invite_cont,{y:[450, objects.invite_cont.sy]}, true, 0.6,'easeOutBack');

		//копируем предварительные данные
		cards_menu._opp_data = {uid:objects.mini_cards[cart_id].uid,name:objects.mini_cards[cart_id].name,rating:objects.mini_cards[cart_id].rating};


		let invite_available = 	cards_menu._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="o" || objects.mini_cards[cart_id].state==="b");
		invite_available=invite_available || cards_menu._opp_data.uid==="AI";

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=invite_available;


		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		make_text(objects.invite_name,cards_menu._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;

	},

	close: function() {

		objects.cards_cont.visible=false;
		objects.back_button.visible=false;
		objects.desktop.visible=false;

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
		firebase.database().ref("states").off();

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


		if (objects.invite_cont.ready === false || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
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
			objects.invite_header6.text = ['Ждем ответ...','Await...'][LANG];
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;
		}



	},

	rejected_invite: function() {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show("Соперник отказался от игры",'(((');

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

var auth = function() {
	
	return new Promise((resolve, reject)=>{

		let help_obj = {

			loadScript : function(src) {
			  return new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.type = 'text/javascript'
				script.onload = resolve
				script.onerror = reject
				script.src = src
				document.head.appendChild(script)
			  })
			},

			vkbridge_events: function(e) {

				if (e.detail.type === 'VKWebAppGetUserInfoResult') {

					my_data.name 	= e.detail.data.first_name + ' ' + e.detail.data.last_name;
					my_data.uid 	= "vk"+e.detail.data.id;
					my_data.pic_url = e.detail.data.photo_100;

					//console.log(`Получены данные игрока от VB MINIAPP:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);
					help_obj.process_results();
				}
			},

			init: function() {

				let s = window.location.href;

				//-----------ЯНДЕКС------------------------------------
				if (s.includes("yandex")) {
					Promise.all([
						this.loadScript('https://yandex.ru/games/sdk/v2')
					]).then(function(){
						help_obj.yandex();
					});
					return;
				}


				//-----------ВКОНТАКТЕ------------------------------------
				if (s.includes("vk.com")) {
					Promise.all([
						this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')

					]).then(function(){
						help_obj.vk()
					});
					return;
				}


				//-----------ЛОКАЛЬНЫЙ СЕРВЕР--------------------------------
				if (s.includes("192.168")) {
					help_obj.debug();
					return;
				}


				//-----------НЕИЗВЕСТНОЕ ОКРУЖЕНИЕ---------------------------
				help_obj.unknown();

			},

			yandex: function() {

				game_platform="YANDEX";
				if(typeof(YaGames)==='undefined')
				{
					help_obj.local();
				}
				else
				{
					//если sdk яндекса найден
					YaGames.init({}).then(ysdk => {

						//фиксируем SDK в глобальной переменной
						window.ysdk=ysdk;

						//запрашиваем данные игрока
						return ysdk.getPlayer();


					}).then((_player)=>{

						my_data.name 	= _player.getName();
						my_data.uid 	= _player.getUniqueID().replace(/\//g, "Z");
						my_data.pic_url = _player.getPhoto('medium');

						//console.log(`Получены данные игрока от яндекса:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

						//если личные данные не получены то берем первые несколько букв айди
						if (my_data.name=="" || my_data.name=='')
							my_data.name=my_data.uid.substring(0,5);

						help_obj.process_results();

					}).catch((err)=>{

						//загружаем из локального хранилища если нет авторизации в яндексе
						help_obj.local();

					})
				}
			},

			vk: async function() {

				game_platform="VK";
				
				let e={};
				try {
					await vkBridge.send('VKWebAppInit');
					e = await vkBridge.send('VKWebAppGetUserInfo');
				} catch (error) {
					alert(error.stack)
				}		

				
				my_data.name 	= e.first_name + ' ' + e.last_name;
				my_data.uid 	= "vk"+e.id;
				my_data.pic_url = e.photo_100;

				help_obj.process_results();		
					

			},

			debug: function() {

				game_platform = "debug";
				let uid = prompt('Отладка. Введите ID', 100);

				my_data.name = my_data.uid = "debug" + uid;
				my_data.pic_url = "https://sun9-73.userapi.com/impf/c622324/v622324558/3cb82/RDsdJ1yXscg.jpg?size=223x339&quality=96&sign=fa6f8247608c200161d482326aa4723c&type=album";

				help_obj.process_results();

			},

			local: function(repeat = 0) {

				game_platform="YANDEX";

				//ищем в локальном хранилище
				let local_uid = null;
				try {
					local_uid = localStorage.getItem('uid');
				} catch (e) {
					console.log(e);
				}

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");

					let rnd_names=["Бегемот","Жираф","Зебра","Тигр","Ослик","Мамонт","Волк","Лиса","Мышь","Сова","Слон","Енот","Кролик","Бизон","Пантера"];
					let rnd_num=Math.floor(Math.random()*rnd_names.length)
					let rand_uid=Math.floor(Math.random() * 9999999);

					my_data.name 		=	rnd_names[rnd_num]+rand_uid;
					my_data.record 		= 	0;
					my_data.uid			=	"ls"+rand_uid;
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';


					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {
													
							//если повтоно нету данных то выводим предупреждение
							if (repeat === 1)
								alert('Какая-то ошибка');
							
							//console.log(`Нашли данные в ЛХ но не нашли в ФБ, повторный локальный запрос...`);	

							
							//повторно запускаем локальный поиск						
							localStorage.clear();
							help_obj.local(1);	
								
							
						} else {						
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;
							help_obj.process_results();
						}

					})	

				}


			},

			unknown: function () {

				game_platform="unknown";
				alert("Неизвестная платформа! Кто Вы?")

				//загружаем из локального хранилища
				help_obj.local();
			},

			process_results: function() {


				//отображаем итоговые данные
				//console.log(`Итоговые данные:\nПлатформа:${game_platform}\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

				//обновляем базовые данные в файербейс так могло что-то поменяться
				firebase.database().ref("players/"+my_data.uid+"/name").set(my_data.name);
				firebase.database().ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);
				firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);

				//вызываем коллбэк
				resolve("ok");
			},

			process : function () {

				objects.id_loup.x=20*Math.sin(game_tick*8)+90;
				objects.id_loup.y=20*Math.cos(game_tick*8)+110;
			}
		}

		help_obj.init();

	});	
	
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

	firebase.database().ref("states/"+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

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
		await auth();
			
		//устанавлием имя на карточки
		make_text(objects.id_name,my_data.name,150);
		make_text(objects.my_card_name,my_data.name,150);
			
		//ждем пока загрузится аватар
		let loader=new PIXI.Loader();
		loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
		await new Promise((resolve, reject)=> loader.load(resolve))
		

		objects.id_avatar.texture=objects.my_avatar.texture=loader.resources.my_avatar.texture;
		
		//получаем остальные данные об игроке
		let snapshot = await firebase.database().ref("players/"+my_data.uid).once('value');
		let data = snapshot.val();
		
		//делаем защиту от неопределенности
		data===null ?
			my_data.rating=1400 :
			my_data.rating = data.rating || 1400;
			
		data===null ?
			my_data.games = 0 :
			my_data.games = data.games || 0;

		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

		//обновляем почтовый ящик
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		//подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

		//обновляем данные в файербейс так как могли поменяться имя или фото
		firebase.database().ref("players/"+my_data.uid).set({name:my_data.name, pic_url: my_data.pic_url, rating : my_data.rating, games : my_data.games, tm:firebase.database.ServerValue.TIMESTAMP});

		//устанавливаем мой статус в онлайн
		set_state({state : 'o'});

		//отключение от игры и удаление не нужного
		firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
		firebase.database().ref("states/"+my_data.uid).onDisconnect().remove();

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

async function init_game_env() {
	
	
	//ждем когда загрузятся ресурсы
	await load_resources();

	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

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

async function load_resources() {


	
	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/


	let git_src="https://akukamil.github.io/quoridor"
	//let git_src=""


	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"fonts/Neucha/font.fnt");




	game_res.add('click',git_src+'/sounds/click.mp3');
	game_res.add('locked',git_src+'/sounds/locked.mp3');
	game_res.add('clock',git_src+'/sounds/clock.mp3');
	game_res.add('close_it',git_src+'/sounds/close_it.mp3');
	game_res.add('game_start',git_src+'/sounds/game_start.mp3');
	game_res.add('lose',git_src+'/sounds/lose.mp3');
	game_res.add('receive_move',git_src+'/sounds/receive_move.mp3');
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
	
	//отдельно загружаем тайлинговый спрайта
	game_res.add('tile_img',git_src+'/res/tile_img.png');

	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"stickers/"+i+".png");
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/" + load_list[i].name + "." +  load_list[i].image_format);		


	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	

	
	await new Promise((resolve, reject)=> game_res.load(resolve))

}

function main_loop() {


	game_tick+=0.016666666;
	anim2.process();
	anim3.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();


	requestAnimationFrame(main_loop);
}


