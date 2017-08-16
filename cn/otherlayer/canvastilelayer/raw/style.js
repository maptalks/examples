var mapzenStyle = {
    'roads' : [
        {
            filter : ['==', 'kind', 'highway'],
            symbol : [
                {
                    'lineColor' : 'grey',
                    'lineWidth' : 7
                },
                {
                    'lineColor' : '#cc6666',
                    'lineWidth' : 4
                }
            ]
        },
        {
            filter : ['==', 'kind', 'minor_road'],
            symbol : {
                'lineColor' : 'lightgrey',
                'lineWidth' : 3
            }
        },
        {
            filter : true,
            symbol : {
                'lineColor' : 'lightgrey',
                'lineWidth' : 2
            }
        }
    ],

    'buildings' : [
        {
            filter : true,
            symbol : {
                'lineColor' : '#000',
                'polygonFill' : '#fff'
            }
        }
    ],

    'water' : [
        {
            filter : ['==', '$type', 'Point'],
            symbol : {
                'markerOpacity' : 0,
                'markerType' : 'ellipse',
                'markerFill' : '#88bbee',
                'markerWidth' : 4,
                'markerHeight' : 4
            }
        },

        {
            filter : true,
            symbol : {
                'lineColor' : '#88bbee',
                'polygonFill' : '#88bbee'
            }
        }
    ],

    'earth' : [
        {
            filter : ['==', '$type', 'Point'],
            symbol : {
                'markerOpacity' : 0,
                'markerType' : 'ellipse',
                'markerFill' : '#ddeeee',
                'markerWidth' : 4,
                'markerHeight' : 4
            }
        },
        {
            filter : true,
            symbol : {
                'lineColor' : '#ddeeee',
                'polygonFill' : '#ddeeee'
            }
        }
    ],

    'landuse' : [
        {
            filter : ['==', '$type', 'Point'],
            symbol : {
                'markerOpacity' : 0,
                'markerType' : 'ellipse',
                'markerFill' : '#aaffaa',
                'markerWidth' : 4,
                'markerHeight' : 4
            }
        },
        {
            filter : true,
            symbol : {
                'lineColor' : '#aaffaa',
                'polygonFill' : '#aaffaa'
            }
        }
    ]
};
