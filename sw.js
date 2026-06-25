const V_WALL = 2, H_WALL = 1, ROW0 = 0, ROW8 = 8, MY_ID = 1, OPP_ID = 2, MAX_MOVES = 50

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

//[r,c]
const  walls_pos = [
[1,-1],[0,-1],[2,0],[1,0],[0,0],[-1,0],[2,1],[1,1],[0,1],[-1,1],[1,2],[0,2],
[-1,-1],[2,-1],[2,2],[-1,2],[0,-2],[-1,-2],[-2,0],[-2,1],[3,0],[3,1],[1,-2]]

let gid=0
let stop_flag=0
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
		
		const player_to_move = 3 - this.player_id;
		
		//добаляем ноды с ходами
		let moves = ffunc.get_moves(this.field, player_to_move);		
		for (let i = 0 ; i < moves.length; i++) {
			
			let node = new node_class(this.field, player_to_move, this.depth + 1);			
			ffunc.make_move(node.field, moves[i].r0, moves[i].c0, moves[i].r1, moves[i].c1);
			if (save_move_data === 1)
				node.move_data = JSON.parse(JSON.stringify(moves[i]));	
			this.childs.push(node);
		}		
		
		//если у игрока нету стен
		if (!this.field.pos[player_to_move].walls) return;
		
		//теукщее положение игрока
		const player_positions = [
			{r:this.field.pos[player_to_move].r,c:this.field.pos[player_to_move].c},
			{r:this.field.pos[3-player_to_move].r,c:this.field.pos[3-player_to_move].c}
		]

			
		for (let r=1;r<9;r++){
			for (let c=1;c<9;c++){					
				
				for (let WALL_ORIENT=1;WALL_ORIENT<3;WALL_ORIENT++){
					
					if (ffunc.check_new_wall(this.field, r, c, WALL_ORIENT) === 1 &&
						ffunc.check_if_wall_block (this.field, r, c, WALL_ORIENT)===0) {	
						
						const node = new node_class(this.field, player_to_move, this.depth + 1);	
						if (save_move_data === 1)
							node.move_data = {type : 'wall', r : r, c : c, wall_type : WALL_ORIENT};	
						node.field.f[r][c].wall_type = WALL_ORIENT;
						this.childs.push(node);
					}			
				}				
			}
		}
			
	
	}

}

function start_mm_search(node) {
	
	//ходит бот
	node.add_childs(1);
	let max_val = -999999;
	let best_child = {};
	for (let c0 of node.childs) {			
				
		//проверяем что этот ход ведет напрямую к выигрышу
		if (ffunc.get_winner(c0.field) === OPP_ID)
			return c0;
					
		//ходит игрок
		c0.add_childs(0);
		let min_val1 = 99999;
		for (let c1 of c0.childs) {
			
			//ходит бот
			/*c1.add_childs(0);
			let max_val2 = -99999;
			for (let c2 of c1.childs) {								
									
				const d_for_my = ffunc.get_shortest_distance_to_target(c2.field,MY_ID,ROW0);
				const d_for_opp = ffunc.get_shortest_distance_to_target(c2.field,OPP_ID,ROW8);
				const how_opp_faster = d_for_my - d_for_opp;
				
				if (how_opp_faster > max_val2)
					max_val2 = how_opp_faster;
			}	*/		
		
			const d_for_my = ffunc.get_shortest_distance_to_target(c1.field,MY_ID,ROW0);
			const d_for_bot = ffunc.get_shortest_distance_to_target(c1.field,OPP_ID,ROW8);
			const how_bot_faster = d_for_my-d_for_bot;


			if (min_val1 > how_bot_faster)
				min_val1 = how_bot_faster			
		}	

	if (min_val1 > max_val) {
		max_val = min_val1			
		best_child = c0			
	}
	
	}

	return best_child;
	
}
	
self.addEventListener('message', event => {
	if (event.data.type === 'mm') {
		stop_flag=0
		gid=event.data.gid
		const root_node = new node_class(event.data.f, 1, 0)
		const best_child = start_mm_search(root_node)
		event.source.postMessage({move_data:best_child.move_data,gid});
	}
	
});
