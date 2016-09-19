function Mapa() {
	var map;
	var draw;
	var source;
	var selectSingleClick;
	var modify;
	var popup;
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
			name : descricao,
			geometry : thing
		});
		return feature;
	},
	getSelectSingleClick : function() {
		return this.selectSingleClick;
	},
	addInteraction : function(interaction) {
		this.map.addInteraction(interaction);
	},
	removeInteractions : function() {
		this.map.removeInteraction(this.draw);
		this.map.removeInteraction(this.modify);
		this.popup.hide();
	},
	addDrawInteraction : function() {
		this.removeInteractions();
		this.map.removeInteraction(this.selectSingleClick);
		this.map.addInteraction(this.draw);
	},
	addSelectSingleClickInteraction : function() {
		this.removeInteractions();
		this.map.addInteraction(this.selectSingleClick);
	},
	addModifyInteraction : function() {
		this.removeInteractions();
		this.map.removeInteraction(this.selectSingleClick);
		this.map.addInteraction(this.modify);
	},
	defineStyle : function(backgroundColor, borderColor) {
		source = this.source;
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
				text : source.Feature,
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

		var raster = new ol.layer.Tile({
			source : new ol.source.OSM("Mapa")
		});

		this.source = this.vector(geojsonObject);

		// Adicionar evento que irá executar, quando
		// terminar de desenha polygon
		this.source.on('addfeature', function(evt) {
			_this.notifyAddFeature(evt.feature);
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
			source : _this.source,
			style : _this.defineStyle('rgba(255, 255, 255, 0.6)', '#319FD3') 
		});

		var select = new ol.interaction.Select({
			wrapX : false
		});

		this.modify = new ol.interaction.Modify({
			features : select.getFeatures()
		});
		
		this.modify.on('modifyend', function(e) {
			_this.notifyAddFeature(e.features.getArray()[0]);
		});

		this.map = new ol.Map({
			interactions : ol.interaction.defaults().extend([ select ]),
			layers : [ raster, vector ],
			target : 'map',
			view : new ol.View({
				projection : 'EPSG:4326',
				center : [-45.8944950663676, -23.198074855969935],
				zoom : 15
			})
		});

//		if(this.source.getFeatures().length > 0 ) {
//			 this.map.getView().fit(this.source.getExtent(), this.map.getSize());
//		 }

		var value = 'Polygon';
		this.draw = new ol.interaction.Draw({
			source : this.source,
			type : /** @type {ol.geom.GeometryType} */
			(value)
		});
		
		this.popup = new ol.Overlay.Popup();
		this.popup.setOffset([ 0, -55 ]);

		this.map.addOverlay(this.popup);

		this.map.addInteraction(this.selectSingleClick);
		this.selectSingleClick.on('select', function(e) {
			_this.buildPopup(e.selected.length, e.deselected.length, e.selected[0]);
			
		});
		
		_this.map.on('click', function(evt) {
			console.log(evt.coordinate);
		});
	},
	carregaGeoJsonObject : function(data) {
		var features = [];
		for (var i = 0; i < data.length; i++) {
			var aux = [];
			var x = data[i].localeArray;
			features.push({
				'type' : 'Feature',
				'properties' : {
					'id' : data[i]['codigo'],
					'name' : data[i]['codigo'] + ' - ' + data[i]['descricao'],
				},
				'geometry' : {
					'type' : 'Polygon',
					'coordinates' : [ x ]
				},
			// 'style': this.defineStyle(data[i]['backgroundColor'],
			// data[i]['borderColor'])
			});
		}
		var geojsonObject = {
			'type' : 'FeatureCollection',
			'crs' : {
				'type' : 'name',
			},
			'features' : features
		};
		return geojsonObject;
	},
	buscarArea : function(codArea) {
		var source;
		if (codArea != undefined && codArea != '') {
			this.source.forEachFeature(function(feature) {
				if (feature.get('id') === codArea) {
					source = new ol.source.Vector({
						features : [ feature ],
						wrapX : false
					});
				}
			});
		} else {
			source = this.source;
		}
		this.map.getView().fit(source.getExtent(), this.map.getSize());
	},
	notifyAddFeature : function(feature) {
		this.openFormSave.notify({
			coords : feature.getGeometry().getCoordinates(),
			feature : feature
		});
	},
	buildPopup : function(lenSele, lenDese, selected) {
		if (lenSele == 1) {
			var infoArea = selected.get('name');
			var content = '<div class="divPopup"><p>' + infoArea
					+ '</p></div>';
			this.popup.show(selected.getGeometry().getExtent(), content);
			coords = selected.getGeometry().getCoordinates();
			this.openFormSave.notify({
				coords : coords,
				feature : selected
			});
		} else if (lenDese == 1) {
			this.popup.hide();
		}
	},
	setSource : function(source) {
		this.source = source;
	}, 
	vector : function(geoJSON) {
		return  new ol.source.Vector({features : (new ol.format.GeoJSON()).readFeatures(this.carregaGeoJsonObject(geoJSON)), wrapX : false});
	}
}
