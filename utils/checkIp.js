// middleware для проверки IP адресов
export default (req, res, next) => {
    const trustedIps = ['185.71.76.0/27','185.71.77.0/27','77.75.153.0/25','77.75.156.11','77.75.156.35','77.75.154.128/25','2a02:5180::/32']; // список доверенных IP адресов
     // получаем IP адрес клиента из запроса
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (trustedIps.indexOf(clientIp) !== -1) {
        console.log('ip адрес проверка прошел')
        // IP адрес клиента в списке доверенных, продолжаем выполнение
        next();
    } else {
        console.log('ip адрес проверку не прошел: ', clientIp)
        // IP адрес клиента не в списке доверенных, отсылается ответ 403 Forbidden
        res.sendStatus(403);
    }
};