module.exports = function(){
    var fs = require('fs');
    
    var tempData = {
        get:getData
    };
    
    function getData(){
        var data;
        try {
            data = fs.readFileSync(process.cwd()+'/data/sitemmap.json', 'utf8');
            try {
                JSON.parse(data);
            } catch(e) {
                data = [];
            }
        } catch (e) {
            // File not found
            if (e.code === 'ENOENT') {
                console.log('File not found', process.cwd());
            } else {
                throw e;
            }
        };
        return data;
    }
    

    return tempData;
}
