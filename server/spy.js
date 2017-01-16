var crypto = require(__dirname + '/crypto/cryptographer');

crypto.encrypt('Middlesb0r0')
    .then(function(result) { 

        console.log('result = ' + result);

    })
    .catch(function(error) { 

        console.error('Error: ' + error);

    });

crypto.compare('Middlesb0r0', '$2a$10$Vz4ebfoRkgTQKMjJiY43yOerJ7/h56FaGT1Q0qn8r2e3fptB4ug6W')
    .then(function(result) {

        console.log('decrypt result match? ' + result);

    })
    .catch(function(error) { 

        console.error('Error: ' + error);

    });
