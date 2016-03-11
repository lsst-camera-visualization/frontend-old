function read_boundary(data, cb){
    firefly.getJsonFromTask('python', 'boundary', data).then(function(data){
        var d = data.WITHOUT_OSCN.SEG_BOUNDARY;
        var regions = [];
        var color = 'black';
        for (var i=0; i<d.length; i++){
            var di = d[i];
            for (var j=0; j<di.length; j++){
               var dij = di[j];
                console.log(JSON.stringify(dij));
               var height = Math.abs(dij[1][1]-dij[1][0]);
               var width = Math.abs(dij[0][0]-dij[0][1]);
               var x = Math.min(dij[0][0], dij[0][0]);
               var y = Math.max(dij[1][1], dij[1][1]);
               var content = ['box', x, y, width, height, 0, '#color='+color].join(' '); 
               regions.push(content);
            }
        }
        cb(regions);
    });
}
