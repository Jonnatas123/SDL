function Mapa() {
	var map = null;
	var source = null;
	var selectSingleClick = null;
	var _this = this;
	
	this.openFormSave = new Event(this);
}

Mapa.prototype = {
	addFeature : function(feature) {
		this.source.addFeature(feature);
	},
	createPolygon : function(coords, codigo, descricao) {
		var thing = new ol.geom.Polygon([ coords ]);
		// thing.transform('EPSG:4326', 'EPSG:3857');
		var feature = new ol.Feature({
			id : codigo,
			name : 'foo',
			geometry : thing
		});
		return feature;
	},
	getDrawInteraction : function() {
		var value = 'Polygon';
		var draw;
		draw = new ol.interaction.Draw({
			source : this.source,
			type : /** @type {ol.geom.GeometryType} */
			(value)
		});
		return draw;
	},
	getSelectSingleClick : function() {
		return this.selectSingleClick;
	},
	addInteraction : function(interaction) {
		this.map.addInteraction(interaction);
	},
	removeInteraction : function(interaction) {
		this.map.removeInteraction(interaction);
	},
	defineStyle: function(backgroundColor, borderColor) {
		style = new ol.style.Style({
			fill : new ol.style.Fill({
				color : backgroundColor
			}),
			stroke : new ol.style.Stroke({
				color : borderColor,
				width : 1
			}),
			image : new ol.style.Circle({
				radius : 7,
				fill : new ol.style.Fill({
					color : '#ffcc33'
				})
			}),
			text : new ol.style.Text({
				font : '12px helvetica,sans-serif',
				text : this._mapa.source.Feature,
				rotation : 360 * Math.PI / 180,
				fill : new ol.style.Fill({
					color : '#000'
				}),
				stroke : new ol.style.Stroke({
					color : '#fff',
					width : 1
				})
			})
		})
		return style;
	},
	buildMapa : function(geojsonObject) {
		var _this = this;
		geojsonObject = this.carregaGeoJsonObject(geojsonObject);
		
		var raster = new ol.layer.Tile({
			// source : new ol.source.MapQuest({
			// layer : 'sat'
			// }),
			source : new ol.source.OSM()
		});
		
		this.source = new ol.source.Vector({
			features : (new ol.format.GeoJSON()).readFeatures(geojsonObject),
			wrapX : false
		});
		
		// Adicionar evento que irá executar, quando
		// terminar de desenha polygon
		this.source.on('addfeature', function(evt) {
			var feature = evt.feature;
			var coords = feature.getGeometry().getCoordinates();
			_this.openFormSave.notify({ coords : coords, feature : feature});
//			openForm(tranformToObj(coords), feature.get('id'), feature.get('name'));
		});
		
		this.selectSingleClick = new ol.interaction.Select({
			style : new ol.style.Style({
				stroke : new ol.style.Stroke({
					color : 'red',
					width : 2
				})
			}),
			filter : function(feature, layer) {
				return true;
			}
		});
		
		var vector = new ol.layer.Vector({
			source : this.source,
			style : new ol.style.Style({
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.6)'
				}),
				stroke : new ol.style.Stroke({
					color : '#319FD3',
					width : 1
				}),
				image : new ol.style.Circle({
					radius : 7,
					fill : new ol.style.Fill({
						color : '#ffcc33'
					})
				}),
				text : new ol.style.Text({
					font : '12px helvetica,sans-serif',
					text : this.source.Feature,
					rotation : 360 * Math.PI / 180,
					fill : new ol.style.Fill({
						color : '#000'
					}),
					stroke : new ol.style.Stroke({
						color : '#fff',
						width : 1
					})
				})
			})
		});
		
		this.map = new ol.Map({
			layers : [ raster, vector ],
			target : 'map',
			view : new ol.View({
				center : [ -11000000, 4600000 ],
				zoom : 4
			})
		});
		
		// vector.setMap(map);
		var popup = new ol.Overlay.Popup;
		popup.setOffset([ 0, -55 ]);
		
		this.map.addOverlay(popup);
		this.map.on('singleclick', function(evt) {
			var feature = _this.map.forEachFeatureAtPixel(evt.pixel, function(feature,
					layer) {
			})
		});
		
		this.map.addInteraction(this.selectSingleClick);
		this.selectSingleClick.on('select', function(e) {
			var lenSele = e.selected.length;
			var lenDese = e.deselected.length;
			if (lenSele == 1) {
				var infoArea = e.selected[0].get('name');
				var content = '<div class="divPopup"><p>' + infoArea + '</p></div>';
						popup.show(e.selected[0].getGeometry().getExtent(), content);
			} else if (lenDese == 1) {
				popup.hide();
			}
		});
		 _this.map.on('click', function(evt) {
			 console.log(evt.coordinate);
		 });

		// $('.btnDelete').on('click', function(){
		// var features = source.getFeatures();
		// for(f in features) {
		// if(features[f].get('name') === feature) {
		// source.removeFeature(features[f]);
		// popup.hide();
		// break;
		// }
		// }
		// });
	},
	carregaGeoJsonObject : function(data) {
		var features = [];
		for (var i = 0; i < data.length; i++) {
			var aux = [];
			var x = data[i].localeArray;
			features.push({
				'type' : 'Feature',
				'properties' : {
					'name' : data[i]['codigo'] + ' - ' + data[i]['descricao'],
				},
				'geometry' : {
					'type' : 'Polygon',
					'coordinates' : [ x ]
				},
//				'style': this.defineStyle(data[i]['backgroundColor'], data[i]['borderColor'])
			});
		}
		var geojsonObject = {
			'type' : 'FeatureCollection',
			'crs' : {
				'type' : 'name',
				'properties' : {
					'name' : 'EPSG:3857'
				}
			},
			'features' : features
		};
		return geojsonObject;
	}
}

//$(function() {
//	var map;
//	var draw; // global so we can remove it later
//	var source;
//	var selectSingleClick;
//
//});
//
///* Montar opção para realizar draw */
//var source;
//
//function addFeature(feature) {
//	source.addFeature(feature)
//}
//
//function createPolygon(coords, codigo, descricao) {
//	var thing = new ol.geom.Polygon([ coords ]);
//	// thing.transform('EPSG:4326', 'EPSG:3857');
//	var feature = new ol.Feature({
//		id : codigo,
//		name : 'foo',
//		geometry : thing
//	});
//
//	// feature.setId(codigo);
//	return feature;
//}
//
//function mapa(geojsonObject) {
//
//	var raster = new ol.layer.Tile({
//		// source : new ol.source.MapQuest({
//		// layer : 'sat'
//		// }),
//		source : new ol.source.OSM()
//	});
//
//	source = new ol.source.Vector({
//		features : (new ol.format.GeoJSON()).readFeatures(geojsonObject),
//		wrapX : false
//
//	});
//
//	// Adicionar evento que irá executar, quando
//	// terminar de desenha polygon
//	source.on('addfeature',
//			function(evt) {
//				var feature = evt.feature;
//				var coords = feature.getGeometry().getCoordinates();
//				openForm(tranformToObj(coords), feature.get('id'), feature
//						.get('name'));
//			});
//
//	selectSingleClick = new ol.interaction.Select({
//		style : new ol.style.Style({
//			stroke : new ol.style.Stroke({
//				color : 'red',
//				width : 2
//			})
//		}),
//		filter : function(feature, layer) {
//			return true;
//		}
//	});
//
//	var vector = new ol.layer.Vector({
//		source : source,
//		style : new ol.style.Style({
//			fill : new ol.style.Fill({
//				color : 'rgba(255, 255, 255, 0.6)'
//			}),
//			stroke : new ol.style.Stroke({
//				color : '#319FD3',
//				width : 1
//			}),
//			image : new ol.style.Circle({
//				radius : 7,
//				fill : new ol.style.Fill({
//					color : '#ffcc33'
//				})
//			}),
//			text : new ol.style.Text({
//				font : '12px helvetica,sans-serif',
//				text : source.Feature,
//				rotation : 360 * Math.PI / 180,
//				fill : new ol.style.Fill({
//					color : '#000'
//				}),
//				stroke : new ol.style.Stroke({
//					color : '#fff',
//					width : 1
//				})
//			})
//		})
//
//	});
//
//	map = new ol.Map({
//		layers : [ raster, vector ],
//		target : 'map',
//		view : new ol.View({
//			center : [ -11000000, 4600000 ],
//			zoom : 4
//		})
//	});
//
//	// vector.setMap(map);
//	var popup = new ol.Overlay.Popup;
//	popup.setOffset([ 0, -55 ]);
//	map.addOverlay(popup);
//
//	map.on('singleclick', function(evt) {
//		var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature,
//				layer) {
//		})
//	});
//
//	map.addInteraction(selectSingleClick);
//	selectSingleClick.on('select',
//			function(e) {
//				var lenSele = e.selected.length;
//				var lenDese = e.deselected.length;
//
//				if (lenSele == 1) {
//					var infoArea = e.selected[0].get('name');
//
//					console.log();
//					var content = '<div class="divPopup"><p>' + infoArea
//							+ '</p></div>';
//					popup
//							.show(e.selected[0].getGeometry().getExtent(),
//									content);
//
//				} else if (lenDese == 1) {
//					popup.hide();
//				}
//
//			});
//
//	// map.on('click', function(evt) {
//	// console.log(evt.coordinate);
//	// });
//
//	// $('.btnDelete').on('click', function(){
//	// var features = source.getFeatures();
//	// for(f in features) {
//	// if(features[f].get('name') === feature) {
//	// source.removeFeature(features[f]);
//	// popup.hide();
//	// break;
//	// }
//	// }
//	// });
//
//}
//
//function getDrawInteraction() {
//	var value = 'Polygon';
//	var draw;
//	draw = new ol.interaction.Draw({
//		source : source,
//		type : /** @type {ol.geom.GeometryType} */
//		(value)
//	});
//
//	return draw;
//}
//
//function getSelectSingleClick() {
//	return selectSingleClick;
//}
//
//function addInteraction(interaction) {
//
//	map.addInteraction(interaction);
//}
//
//function removeInteraction(interaction) {
//	map.removeInteraction(interaction);
//}

