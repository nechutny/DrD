predmety = {
	/*
	 * data[i]
	 *		name (string)
	 *		count (number)
	 * 		count_suffix (number)
	 * 		carry (number)
	 *
	 */
		data : new Array(),

		place : new Array(),

		placeAdd : function(name)
		{
			id = predmety.place.length;
			predmety.place[id] = name;

			return id;
		},

		placeRemove : function(id) {
			predmety.place[id] = undefined;
			predmety.redraw();
		},
		
		// Add new item to object
		add : function(name, count, count_suffix) {
			predmety.data[predmety.data.length] = {
				'name'			: name,
				'count'			: count,
				'count_suffix'	: count_suffix,
				'carry'			: 0,
			};
			predmety.save();
			predmety.redraw();
		},
		
		// Remove item from object
		remove : function(id) {
			predmety.data.splice(id,1);
			predmety.save();
			predmety.redraw();
		},
		
		// Show dialog for edit and fill values
		start_edit : function(id)
		{
			predmety.current_action = "edit";
			predmety.current_id = id;

			$("#postava_vybaveni_jmeno").val(predmety.data[id].name);
			$("#postava_vybaveni_pocet").val(predmety.data[id].count);
			jednotky.chosen(predmety.data[id].count_suffix);
			$("#postava_vybaveni_usebe").prop("checked",!predmety.data[id].carry);

			$('#postava_vybaveni_modal').modal();
		},
			
		// Edit item in object
		edit : function(id,name,count, count_suffix) {
			predmety.data[id] = {
				'name'			: name,
				'count'			: count,
				'count_suffix'	: count_suffix,
				'carry'			: predmety.data[id].carry,
			};
			predmety.save();
			predmety.redraw();
		},

		moveAll : function(where)
		{
			$("input[type=checkbox].vybaveni_odlozit:checked").each(function(key,val)
			{
				predmety.move($(val).val(),where);
			});
			
			predmety.save();
			predmety.redraw();
		},

		getAll : function(id)
		{
			$(".postava_veci_"+id+" li input[type=checkbox]").each(function(key,val){
				predmety.move($(val).val(),0);
			});
			predmety.placeRemove(id);
			predmety.save();
			predmety.redraw();
			
		},
		
		// Swap item
		move : function(id,where) {
			predmety.data[id].carry = where;
			
		},
		
		// edit number of this item
		changeCount : function(id,diff) {
			predmety.data[id].count = parseInt(predmety.data[id].count,10)+parseInt(diff,10);
			predmety.save();
			predmety.redraw();
		},
		
		// Redraw page list
		redraw : function() {
			html1 = "";
			html2 = new Array("");
			i = 0;
			while(i < predmety.data.length)
			{
				html ='<li class="list-group-item" onclick="toggle_buttons(this,event)"><span class="badge">'+predmety.data[i].count+' '+( predmety.data[i].count_suffix == 0 ? "" : jednotky.nazvy[ predmety.data[i].count_suffix ])+'</span> <input type="checkbox" class="vybaveni_odlozit" value="'+i+'" onclick="event.stopPropagation();"> <button onclick="predmety.changeCount('+i+',-1)"><span class="glyphicon glyphicon-minus"></span></button> <button onclick="predmety.changeCount('+i+',+1)"><span class="glyphicon glyphicon-plus"></span></button> <button class="hide" onclick="predmety.start_edit('+i+')"><span class="glyphicon glyphicon-pencil"></span></button> <button  class="hide" onclick="predmety.remove('+i+')"><span class="glyphicon glyphicon-remove"></span></button> <span class="nazev">'+predmety.data[i].name+'</span></li>';
				if(predmety.data[i].carry == 0)
				{
					html1 += html;
				}
				else
				{
					if(typeof html2[predmety.data[i].carry*1] == "undefined")
					{
						html2[predmety.data[i].carry*1] = "";
					}
					html2[predmety.data[i].carry*1] += html;
				}
				i++;
			}
			$("#postava_vybaveni_list").html(html1);

			// sort
			_sort = function(obj)
			{
				
				var li = $(obj).find("li").get();
				
				li.sort(function(a, b) {
					a = $('span.nazev', a).text();
					b = $('span.nazev', b).text();

					return (a < b) ? -1 : ((a > b) ? 1 : 0);
				});
				$(obj).append(li);
			}
			_sort($("#postava_vybaveni_list"));


			$("#postava_odlozeno_list").html("");

			i = 1;
			while(i < predmety.place.length)
			{
				if(predmety.place[i] !== null)
				{
					$("#postava_odlozeno_list").append('<div class="panel panel-default"><div class="panel-heading"><button onclick="predmety.getAll('+i+')"><span class="glyphicon glyphicon-log-in"></span></button> '+predmety.place[i]+'</div><ul class="list-group postava_veci_'+i+'">'+(typeof html2[i] != "undefined" ? html2[i] : "")+'</ul></div>');
					_sort($('.postava_veci_'+i));
				}
				i++;
			}
			if(html2.length == 1)
			{
				predmety.place = new Array("");
			}

			
		},
		
		// Save to localStorage
		save : function() {
			localStorage.setItem("postava_predmety",JSON.stringify(predmety.data));
			localStorage.setItem("postava_predmety_mista",JSON.stringify(predmety.place));
		},
		
		// Load from LocalStorage
		load: function() {
			predmety.data = JSON.parse(localStorage.getItem("postava_predmety"));
			if(predmety.data === null)
			{
				predmety.data = new Array();
			}
			predmety.place = JSON.parse(localStorage.getItem("postava_predmety_mista"));
			if(predmety.place === null)
			{
				predmety.place = new Array("");
			}
		},
		
		current_action: "none",
		current_id: 0,
	};

jednotky = {
	chosen_id : 0,
	nazvy : {
		1  : "Kusů",
		2  : "Balení",
		
		3  : "Dní",
		4  : "Týdnů",
		
		5  : "Lahví",
		6  : "Galonů",
		7  : "Litrů",
		8  : 'Flakón',

		9  : "Sáhů",
		10 : "Coulů",
		11  : "m<sup>2</sup>",

		12 : "Kg",
		},
	oddelovace : {2 : 0, 4: 0, 8 : 0, 11 : 0},
	// draw it
	draw: function() {
		keys = Object.keys(jednotky.nazvy);
		html = "";
		i = 0;
		while(i < keys.length)
		{
			html += '<li><a onclick="jednotky.chosen('+keys[i]+')">'+jednotky.nazvy[ keys[i] ]+'</a></li>';
			if(typeof jednotky.oddelovace[ keys[i] ] != "undefined")
			{
				html += '<li class="divider"></li>';
			}
			i++;
		}
		
		$(".jednotky_list").html(html);
	},
	// save and show selected value
	chosen: function(id) {
		jednotky.chosen_id = id;
		$(".jednotky_list_chosen").html(jednotky.nazvy[id]);
		return false;
	},
	
};




kouzla = {
	/*
	 * data[i]
	 * 		jmeno		(string)
	 * 		magenergie	(number)
	 *		dosah		(string)
	 *		rozsah		(string)
	 *		vyvolani	(string)
	 * 		trvani		(string)
	 * 		popis		(string)
	 */
	data : new Array(),
	current_id : 0,
	current_action : "none",

	add : function(name, magi, dosah, rozsah, vyvolani, trvani, popis) {
		kouzla.data[kouzla.data.length] = {
			jmeno: name,
			magenergie: magi,
			dosah: dosah,
			rozsah: rozsah,
			vyvolani: vyvolani,
			trvani: trvani,
			popis: popis,
			};
		kouzla.save();
		kouzla.redraw()
	},

	remove : function(id) {
		kouzla.data.splice(id,1)
		kouzla.save();
		kouzla.redraw()
	},

	start_edit : function(id)
		{
			kouzla.current_action = "edit";
			kouzla.current_id = id;

			$("#postava_kouzlo_jmeno").val(kouzla.data[id].jmeno),
			$("#postava_kouzlo_magi").val(kouzla.data[id].magenergie),
			$("#postava_kouzlo_dosah").val(kouzla.data[id].dosah),
			$("#postava_kouzlo_rozsah").val(kouzla.data[id].rozsah),
			$("#postava_kouzlo_vyvolani").val(kouzla.data[id].vyvolani),
			$("#postava_kouzlo_trvani").val(kouzla.data[id].trvani),
			$("#postava_kouzlo_popis").val(kouzla.data[id].popis)

			$('#postava_kouzlo_modal').modal();
		},

	edit : function(id, name, magi, dosah, rozsah, vyvolani, trvani, popis) {
		kouzla.data[id] = {
			jmeno: name,
			magenergie: magi,
			dosah: dosah,
			rozsah: rozsah,
			vyvolani: vyvolani,
			trvani: trvani,
			popis: popis,
			};
		kouzla.save();
		kouzla.redraw()
	},

	redraw : function() {
		$("#postava_kouzla_list").html("");
		html = "";
		i = 0;
		while(i < Object.keys(kouzla.data).length)
		{
			if(kouzla.data[i] != null)
			{
				html += '<div class="panel panel-default"><div class="panel-heading"> '+kouzla.data[i]['jmeno']+'<div class="pull-right"><button  onclick="kouzla.start_edit('+i+')"><span class="glyphicon glyphicon-pencil"></span></button> <button onclick="kouzla.remove('+i+')"><span class="glyphicon glyphicon-remove"></span></button></div></div><table class="table table-condensed "><tr><th>Dosah:</th><td>'+kouzla.data[i]['dosah']+'</td><th>Rozsah:</th><td>'+kouzla.data[i]['rozsah']+'</td><th>Magenergie:</th><td>'+kouzla.data[i]['magenergie']+' <button class="spell_cast" data-magi="'+kouzla.data[i]['magenergie']+'"><span class="glyphicon glyphicon-ok-circle"></span></button></td></tr><tr><th>Vyvolání:</th><td>'+kouzla.data[i]['vyvolani']+'</td><th>Trvání:</th><td>'+kouzla.data[i]['trvani']+'</td><th></th><td></td></tr><tr><td colspan="6"><p>'+nl2br(kouzla.data[i]['popis'])+'</p></td></tr></table></div>';
			}
			else
			{
				//console.log(kouzla.data[i]);
			}
			i++;
		}

		$("#postava_kouzla_list").html(html);
		kouzla.recalc_cast();
	},

	recalc_cast : function() {
		magi = parseInt($("#postava_magi").val());
		if(isNaN(magi))
		{
			magi = 0;
		}
		$("button.spell_cast").each(function(key,val){

			if(parseInt($(val).data("magi"),10) <= magi)
			{
				$(val).show();
			}
			else
			{
				$(val).hide();
			}
			
		});
	},

	load : function() {
		kouzla.data = JSON.parse(localStorage.getItem("postava_kouzla"));
		if(kouzla.data === null)
		{
			kouzla.data = new Array();
		}
	},

	save : function(){
		localStorage.setItem("postava_kouzla",JSON.stringify(kouzla.data));
	},
};




dovednosti = {

	'hidden' : false,
	
	redraw : function() {
		$("#postava_dovednosti_list").html("");
		html = "";
		i = 0;
		while(i < Object.keys(dovednosti.kategorie).length)
		{
			html += '<div class="panel panel-default"><div class="panel-heading">'+dovednosti.kategorie[i]['nazev']+'</div><ul class="list-group">';

			j = 0;
			while(j < Object.keys(dovednosti.dovednosti[i]).length)
			{
				bodu = parseInt(localStorage.getItem("postava_dovednosti_"+i+"_"+j),10);
				if(isNaN(bodu) || bodu < 0)
				{
					bodu = 0;
				}
				f = dovednosti.getStupen(dovednosti.dovednosti[i][j].obtiznost,bodu);
				stupen = dovednosti.stupne[ f ];

			
				next_bodu = dovednosti.obtiznosti[ dovednosti.dovednosti[i][j].obtiznost ].body[ f+1 ];
				
				html += '<li class="list-group-item dovednost_bodu_'+bodu+' postava_dovednost_'+i+'_'+j+'" onclick="toggle_buttons(this,event)"> <button onclick="dovednosti.changeCount('+i+','+j+',-1,event)" class="hide"><span class="glyphicon glyphicon-minus"></span></button> <button onclick="dovednosti.changeCount('+i+','+j+',+1,event)" class="hide"><span class="glyphicon glyphicon-plus"></span></button> <span class="badge">'+stupen.nazev+' - '+(stupen.past-parseInt($(dovednosti.kategorie[i]['bonus']).html(),10))+'</span> ['+bodu+'<span class="hide">/'+next_bodu+'</span>] '+dovednosti.dovednosti[i][j].nazev+" <span class='hide'> - "+dovednosti.obtiznosti[ dovednosti.dovednosti[i][j].obtiznost ].nazev+"</span></li>";
				j++;
			}

			html += '</ul></div>';
			
			i++;
		}

		$("#postava_dovednosti_list").html(html);
		if(dovednosti['hidden'] === true)
		{
			$("li.dovednost_bodu_0").hide();
		}
		
	},

	changeCount : function(i,j,diff,event)
	{
		num = parseInt(localStorage.getItem("postava_dovednosti_"+i+"_"+j),10);

		if(isNaN(num))
		{
			num = 0;
		}

		num = num + parseInt(diff,10);

		if(num < 0)
		{
			num = 0;
		}

		localStorage.setItem("postava_dovednosti_"+i+"_"+j,num);

		dovednosti.redraw();
		event.stopPropagation();
		$(".postava_dovednost_"+i+"_"+j).addClass("clicked");
		
	},

	getStupen : function(obtiznost, bodu) {
		if(bodu == 0)
		{ // Optimalization
			return 0; 
		}
		var immm = 0;
		while( immm < Object.keys(dovednosti.obtiznosti[obtiznost].body).length)
		{
			
			if(dovednosti.obtiznosti[obtiznost].body[immm] > bodu)
			{
				return (immm-1);
			}
			immm++;
		}

		return 0;
	},
	
	obtiznosti : {
		0 : {
			body: 	[ 0, 3, 9, 18, 30, 45, 63 ],
			nazev:	"Lehká",
			},
		1 : {
			body:	[ 0, 5, 15, 30, 50, 75, 105],
			nazev: "Střední",
			},
		2 : {
			body: [ 0, 7, 21, 42, 70, 105, 147],
			nazev: "Těžká",
			},
		3 : {
			body: [ 0, 9, 27, 54, 90, 135, 189],
			nazev: "Velmi těžká",
			}
	},

	kategorie : {
		0 : {
			nazev: "Síla",
			bonus: "#postava_sila_bonus",
			},
		1 : {
			nazev: "Obratnost",
			bonus: "#postava_obratnost_bonus",
			},
		2 : {
			nazev: "Odolnost",
			bonus: "#postava_odolnost_bonus",
			},
		3 : {
			nazev: "Inteligence",
			bonus: "#postava_inteligence_bonus",
			},
		4 : {
			nazev: "Charisma",
			bonus: "#postava_charisma_bonus",
			},
	},

	stupne : {
		0 : {
			past : 14,
			nazev: "Vůbec",
		},
		1 : {
			past :	11,
			nazev: "Velmi špatně",
		},
		2 : {
			past :	8,
			nazev: "Špatně",
		},
		3 : {
			past :	5,
			nazev: "Průměrně",
		},
		4 : {
			past :	2,
			nazev: "Dobře",
		},
		5 : {
			past :	-1,
			nazev: "Velmi dobře",
		},
		6 : {
			past :	-4,
			nazev: "Dokonale",
		}
	},

	dovednosti : {
		0 : { // Síla
			0 : {
				nazev:		"Plavání",
				obtiznost:	1,
			},
			1 : {
				nazev:		"Kovářství",
				obtiznost:	2,
			},
			2 : {
				nazev:		"Tesařina",
				obtiznost:	1,
			},
			3 : {
				nazev:		"Zedničina",
				obtiznost:	1,
			},
			4 : {
				nazev:		"Veslování",
				obtiznost:	0,
			},
			5 : {
				nazev:		"Ovládání plachet",
				obtiznost:	1,
			},
			6 : {
				nazev:		"Sprinty",
				obtiznost:	1,
			},
		}, // Obratnost
		1 : {
			0 : {
				nazev:		"Maliřství a jiné výtvarné umění",
				obtiznost:	2,
			},
			1 : {
				nazev:		"Řezbářství",
				obtiznost:	1,
			},
			2 : {
				nazev:		"Truhlářství, hrnčířství a podobná řemesla",
				obtiznost:	1,
			},
			3 : {
				nazev:		"Akrobacie",
				obtiznost:	1,
			},
			4 : {
				nazev:		"Jízda na koni",
				obtiznost:	0,
			},
			5 : {
				nazev:		"Jízda na leteckých nestvůrách",
				obtiznost:	2,
			},
			6 : {
				nazev:		"Vaření",
				obtiznost:	1,
			},
			7 : {
				nazev:		"Padělání",
				obtiznost:	2,
			},
			8 : {
				nazev:		"Kočí (řízení spřežení a povozů)",
				obtiznost:	1,
			},
			9 : {
				nazev:		"Dělostřelec",
				obtiznost:	3,
			},
			10: {
				nazev:		"Minér",
				obtiznost:	2,
			},
		},
		2 : { // Odolnost
			0 : {
				nazev:		"Řeznictví",
				obtiznost:	2,
			},
			1 : {
				nazev:		"Zadržování dechu",
				obtiznost:	2,
			},
			2 : {
				nazev:		"Hasičství",
				obtiznost:	2,
			},
			3 : {
				nazev:		"Koželužnictví",
				obtiznost:	0,
			},
			4 : {
				nazev:		"Nosič",
				obtiznost:	0,
			},
			5 : {
				nazev:		"Asketismus",
				obtiznost:	2,
			},
			6 : {
				nazev:		"Skauting",
				obtiznost:	1,
			},
			7 : {
				nazev:		"Sklářství",
				obtiznost:	2,
			},
		},
		3 : { // Inteligence
			0 : {
				nazev:		"Jazyky",
				obtiznost:	1,
			},
			1 : {
				nazev:		"Čtení a psaní",
				obtiznost:	2,
			},
			2 : {
				nazev:		"Kartografie",
				obtiznost:	1,
			},
			3 : {
				nazev:		"Lodní navigace",
				obtiznost:	2,
			},
			4 : {
				nazev:		"Konstrukce lodí",
				obtiznost:	2,
			},
			5 : {
				nazev:		"Stavitelství",
				obtiznost:	1,
			},
			6 : {
				nazev:		"Astrologie",
				obtiznost:	2,
			},
			7 : {
				nazev:		"Stavitel katapultů",
				obtiznost:	2,
			},
		},
		4 : { // Charisma
			0 : {
				nazev:		"Etiketa",
				obtiznost:	0,
			},
			1 : {
				nazev:		"Učitelství",
				obtiznost:	1,
			},
			2 : {
				nazev:		"Svádění",
				obtiznost:	1,
			},
			3 : {
				nazev:		"Hudba, zpěv",
				obtiznost:	2,
			},
			4 : {
				nazev:		"Tanec",
				obtiznost:	1,
			},
			5 : {
				nazev:		"Vypravěčství",
				obtiznost:	0,
			},
			6 : {
				nazev:		"Handlování",
				obtiznost:	1,
			},
			7 : {
				nazev:		"Ovládání velkých jezdeckých nestvůr",
				obtiznost:	1,
			},
		}
	}
};




// Save value of given input
function input_save(input)
{
	localStorage.setItem($(input).attr("id"), $(input).val());
	redraw_life_progress();
}

// Life progressbar
function redraw_life_progress()
{
	procento = parseInt(localStorage.getItem("postava_zivoty"),10)/parseInt(localStorage.getItem("postava_zivoty_max"),10)*100;
	$("#postava_zivoty_progress").css("width",procento+"%");
	if(parseInt($("#postava_odolnost").val(),10) < 6)
	{
		if(parseInt(localStorage.getItem("postava_zivoty_max"),10)*0.25 >= parseInt(localStorage.getItem("postava_zivoty"),10))
		{
			$("#postava_zivoty_progress").removeClass("progress-bar-info").removeClass("progress-bar-success").addClass("progress-bar-danger");
		}
		else if(parseInt(localStorage.getItem("postava_zivoty_max"),10) > parseInt(localStorage.getItem("postava_zivoty"),10))
		{
			$("#postava_zivoty_progress").addClass("progress-bar-info").removeClass("progress-bar-success").removeClass("progress-bar-danger");
		}
		else
		{
			$("#postava_zivoty_progress").removeClass("progress-bar-info").addClass("progress-bar-success").removeClass("progress-bar-danger");
		}
	}
	else if(parseInt($("#postava_odolnost").val(),10) < 12)
	{
		if(parseInt(localStorage.getItem("postava_zivoty_max"),10)*0.16666 >= parseInt(localStorage.getItem("postava_zivoty"),10))
		{
			$("#postava_zivoty_progress").removeClass("progress-bar-info").removeClass("progress-bar-success").addClass("progress-bar-danger");
		}
		else if(parseInt(localStorage.getItem("postava_zivoty_max"),10) > parseInt(localStorage.getItem("postava_zivoty"),10))
		{
			$("#postava_zivoty_progress").addClass("progress-bar-info").removeClass("progress-bar-success").removeClass("progress-bar-danger");
		}
		else
		{
			$("#postava_zivoty_progress").removeClass("progress-bar-info").addClass("progress-bar-success").removeClass("progress-bar-danger");
		}
	}
	else if(parseInt($("#postava_odolnost").val(),10) < 17)
	{
		if(parseInt(localStorage.getItem("postava_zivoty_max"),10)*0.125 >= parseInt(localStorage.getItem("postava_zivoty"),10))
		{
			$("#postava_zivoty_progress").removeClass("progress-bar-info").removeClass("progress-bar-success").addClass("progress-bar-danger");
		}
		else if(parseInt(localStorage.getItem("postava_zivoty_max"),10) > parseInt(localStorage.getItem("postava_zivoty"),10))
		{
			$("#postava_zivoty_progress").addClass("progress-bar-info").removeClass("progress-bar-success").removeClass("progress-bar-danger");
		}
		else
		{
			$("#postava_zivoty_progress").removeClass("progress-bar-info").addClass("progress-bar-success").removeClass("progress-bar-danger");
		}
	}
	else
	{
		if(1 >= parseInt(localStorage.getItem("postava_zivoty"),10))
		{
			$("#postava_zivoty_progress").removeClass("progress-bar-info").removeClass("progress-bar-success").addClass("progress-bar-danger");
		}
		else if(parseInt(localStorage.getItem("postava_zivoty_max"),10) > parseInt(localStorage.getItem("postava_zivoty"),10))
		{
			$("#postava_zivoty_progress").addClass("progress-bar-info").removeClass("progress-bar-success").removeClass("progress-bar-danger");
		}
		else
		{
			$("#postava_zivoty_progress").removeClass("progress-bar-info").addClass("progress-bar-success").removeClass("progress-bar-danger");
		}
	}  
}

// calculate bonus for stat
function stat_bonus(number)
{
	number = parseInt(number,10);
	if(isNaN(number) || number < 1)
	{
		return "-";
	} else if(number == 1) {
		return -5;
	} else if(number == 2 || number == 3) {
		return -4;
	} else if(number == 4 || number == 5) {
		return -3;
	} else if(number == 6 || number == 7) {
		return -2;
	} else if(number == 8 || number == 9) {
		return -1
	} else if(number >= 10 && number <= 12) {
		return 0;
	} else if(number == 13 || number == 14) {
		return "+1";
	} else if(number == 15 || number == 16) {
		return "+2";
	} else if(number == 17 || number == 18) {
		return "+3";
	} else if(number == 19 || number == 20) {
		return "+4";
	} else {
		return "+5";
	}
}

function toggle_buttons(obj,event)
{
	event.stopPropagation();
	if(!$(obj).hasClass("clicked"))
	{
		$(".clicked").removeClass("clicked");
		$(obj).addClass("clicked");
	}
	else
	{
		$(obj).removeClass("clicked");
	}
}

// update stats bonus
function update_stat_bonus(id)
{
	value = $("#"+id).val();
	$("#"+id+"_bonus").html(stat_bonus(value));
	dovednosti.redraw();
}

stats_disabled = false;

$(document).ready(function()
{
	// Focus on first input in modal
	$('.modal').on('shown.bs.modal', function (e)
	{
		$(e.currentTarget).find("input:first").focus();
	});
	
	// hide buttons in item list if clicked outside
	$("body").click(function(){
		$(".clicked").removeClass("clicked");
	});
	
	// draw units for add/edit items
	jednotky.draw();


	// load items and draw it
	predmety.load();
	predmety.redraw();
	
	// Load data from localStorage
	$("input.save, select.save").each(function(key, val)
	{
		data = localStorage.getItem($(val).attr("id"));
		if(typeof data !== "undefined")
		{
			$(val).val(data);
		}
	});
	$("#postava_zivoty_max").html(localStorage.getItem("postava_zivoty_max"));
	$("#postava_magi_max").html(localStorage.getItem("postava_magi_max"));
	redraw_life_progress();

	// Attach save on change
	$("input.save").keyup(function(obj)
	{
		input_save(obj.currentTarget);
		update_stat_bonus($(obj.currentTarget).attr("id"));
	});

	$("select.save").change(function(obj)
	{
		input_save(obj.currentTarget);
	});

	// Set life as max
	$("#postava_zivoty_save").click(function()
	{
		value = $("#postava_zivoty").val();
		localStorage.setItem("postava_zivoty_max", value);
		$("#postava_zivoty_max").html(value);
		redraw_life_progress()
	});


	// Set magi as max
	$("#postava_magi_save").click(function()
	{
		value = $("#postava_magi").val();
		localStorage.setItem("postava_magi_max", value);
		$("#postava_magi_max").html(value);
	});

	// allow inc/dec for +/- buttons and save it
	$("input.save").parent().find("span.input-group-btn button").click(function(obj)
	{
		if($(obj.currentTarget).parent().parent().find("input.save").prop("disabled"))
		{
			return false;
		}
		
		value = parseInt($(obj.currentTarget).parent().parent().find("input.save").val(),10);

		if(isNaN(value))
		{
			value = 0;
		}
		if($(obj.currentTarget).find("span.glyphicon-plus").length > 0)
		{
			value++;
		}
		else
		{
			value--;
		}
		if(value < 0)
		{
			value = 0;
		}
		$(obj.currentTarget).parent().parent().find("input.save").val(value);
		input_save($(obj.currentTarget).parent().parent().find("input.save"));
		update_stat_bonus($(obj.currentTarget).parent().parent().find("input.save").attr("id"));
	});

	// recalculate stat bonus
	$("input.save.stat_bonus").each(function(key, val)
	{
		update_stat_bonus($(val).attr("id"));
	});

	// lock stats
	$("#postava_zamknout_staty").click(function()
	{
		stats_disabled = !stats_disabled;
		$("input.disable_allowed").prop("disabled",stats_disabled);
		localStorage.setItem("postava_zamceno",stats_disabled ? "yes":"no");
	});
	// load if is locked and if yes, then lock :)
	if(localStorage.getItem("postava_zamceno") === "yes")
	{
		stats_disabled = true;
		$("input.disable_allowed").prop("disabled",stats_disabled);
	}

	// draw skills
	dovednosti.redraw();

	// draw spells
	kouzla.load();
	kouzla.redraw();
	

	// Gold calc
	$("#postava_zlato_kalkulacka_provest").click(function()
	{
		zlato = parseInt($("#postava_zlato_3").val(),10);
		if(isNaN(zlato))
		{
			zlato = 0;
		}
		zlato_1 = zlato*0.01;
		
		zlato = parseInt($("#postava_zlato_2").val(),10);
		if(isNaN(zlato))
		{
			zlato = 0;
		}
		zlato_1 = zlato*0.1 + zlato_1;
		
		zlato = parseInt($("#postava_zlato_1").val(),10);
		if(isNaN(zlato))
		{
			zlato = 0;
		}
		zlato_1 = zlato_1 + zlato;


		zlato = parseInt($("#postava_zlato_kalkulacka_3").val(),10);
		if(isNaN(zlato))
		{
			zlato = 0;
		}
		zlato_2 = zlato*0.01;
		
		zlato = parseInt($("#postava_zlato_kalkulacka_2").val(),10);
		if(isNaN(zlato))
		{
			zlato = 0;
		}
		zlato_2 = zlato*0.1 + zlato_2;
		
		zlato = parseInt($("#postava_zlato_kalkulacka_1").val(),10);
		if(isNaN(zlato))
		{
			zlato = 0;
		}
		zlato_2 = zlato_2 + zlato;


		
		if(!$("#postava_zlato_kalkulacka_operace_1").prop("checked"))
		{
			
			zlato_2 = zlato_2*-1;
		}
		zlato = (zlato_1 +zlato_2).toString();

		$("#postava_zlato_3").val(zlato.substr(-1,1));
		$("#postava_zlato_2").val(zlato.substr(-2,1));
		$("#postava_zlato_1").val(zlato.substr(0,zlato.length-3));

		input_save($("#postava_zlato_3"));
		input_save($("#postava_zlato_2"));
		input_save($("#postava_zlato_1"));
		
	});

	$("#postava_kouzlo_pridat").click(function()
	{
		kouzla.current_action = "add";
		$("#postava_kouzlo_jmeno, #postava_kouzlo_magi, #postava_kouzlo_dosah, #postava_kouzlo_rozsah, #postava_kouzlo_vyvolani, #postava_kouzlo_trvani, #postava_kouzlo_popis").val("")
	});


	// Add item
	$("#postava_vybaveni_pridat").click(function()
	{
		predmety.current_action = "add";
		$("#postava_vybaveni_jmeno").val("");
		$("#postava_vybaveni_pocet").val("1");
	});

	// Add and edit items
	$("#postava_vybaveni_DoIt").click(function(){item_addEdit();});
	$("#postava_vybaveni_jmeno, #postava_vybaveni_pocet").keypress(function(e) {
		if(e.which == 13) {
			item_addEdit();
		}
	});


	$("#postava_kouzlo_DoIt").click(function(){spell_addEdit();});

	$("#postava_vybaveni_presun_DoIt").click(function()
	{
		id = predmety.placeAdd($("#postava_vybaveni_presun_jmeno").val());
		predmety.moveAll(id);
	});

	$("#postava_hide_dovednosti").click(function(){
		if(dovednosti['hidden'] === true)
		{
			$("li.dovednost_bodu_0").show();
			dovednosti['hidden'] = false;
			localStorage.setItem("postava_hide_dovednosti","no");
		}
		else
		{
			$("li.dovednost_bodu_0").hide();
			dovednosti['hidden'] = true;
			localStorage.setItem("postava_hide_dovednosti","yes");
		}
	});

	if(localStorage.getItem("postava_hide_dovednosti") === "yes")
	{
		$("li.dovednost_bodu_0").hide();
		dovednosti['hidden'] = true;
		localStorage.setItem("postava_hide_dovednosti","yes");
	}

	$("input[type=checkbox].switch").bootstrapSwitch({
		onText: "Ano",
		offText: "Ne"
		});
	
});


function item_addEdit()
{
	if(predmety.current_action == "add")
		{
			predmety.add(
				$("#postava_vybaveni_jmeno").val(),
				$("#postava_vybaveni_pocet").val(),
				jednotky.chosen_id
			);
		}
		else
		{
			predmety.edit(
				predmety.current_id,
				$("#postava_vybaveni_jmeno").val(),
				$("#postava_vybaveni_pocet").val(),
				jednotky.chosen_id
			);
		}
}

function spell_addEdit()
{
	if(kouzla.current_action == "add")
		{
			kouzla.add(
				$("#postava_kouzlo_jmeno").val(),
				$("#postava_kouzlo_magi").val(),
				$("#postava_kouzlo_dosah").val(),
				$("#postava_kouzlo_rozsah").val(),
				$("#postava_kouzlo_vyvolani").val(),
				$("#postava_kouzlo_trvani").val(),
				$("#postava_kouzlo_popis").val()
			);
		}
		else
		{
			kouzla.edit(
				kouzla.current_id,
				$("#postava_kouzlo_jmeno").val(),
				$("#postava_kouzlo_magi").val(),
				$("#postava_kouzlo_dosah").val(),
				$("#postava_kouzlo_rozsah").val(),
				$("#postava_kouzlo_vyvolani").val(),
				$("#postava_kouzlo_trvani").val(),
				$("#postava_kouzlo_popis").val()
			);
		}
}



function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
