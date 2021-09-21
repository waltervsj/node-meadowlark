const cluster = require('cluster');

function startWorker(cpu) {
    const worker = cluster.fork();
    console.log(`CLUSTER: Worker ${worker.id} started on ${cpu?.model}.`);
}

if (cluster.isMaster) {
    require('os').cpus().forEach((cpu) => {
        startWorker(cpu);
    })

    cluster.on('disconnect', (worker) => {
        console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
    });

    cluster.on('exit', function(worker, code, signal){
        console.log(`CLUSTER: Worker ${worker.id} died with exit code ${code} (${signal})`);
        startWorker();
    });
   
} else {
    require('./server.js')();
}  