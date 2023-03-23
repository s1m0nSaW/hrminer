import crypto from 'crypto';
const clientSecret = 'CagTnrPiXNZSBnPcMVzl';

export default (req, res, next) => {
    function verifyLaunchParams(searchOrParsedUrlQuery, secretKey) {
        let sign;
        const queryParams = [];

        /**
         * Функция, которая обрабатывает входящий query-параметр. В случае передачи
         * параметра, отвечающего за подпись, подменяет "sign". В случае встречи
         * корректного в контексте подписи параметра добавляет его в массив
         * известных параметров.
         * @param key
         * @param value
         */
        const processQueryParam = (key, value) => {
            if (typeof value === 'string') {
                if (key === 'sign') {
                    sign = value;
                } else if (key.startsWith('vk_')) {
                    queryParams.push({ key, value });
                }
            }
        };

        if (typeof searchOrParsedUrlQuery === 'string') {
            // Если строка начинается с вопроса (когда передан window.location.search),
            // его необходимо удалить.
            const formattedSearch = searchOrParsedUrlQuery.startsWith('?')
                ? searchOrParsedUrlQuery.slice(1)
                : searchOrParsedUrlQuery;

            // Пытаемся разобрать строку как query-параметр.
            for (const param of formattedSearch.split('&')) {
                const [key, value] = param.split('=');
                processQueryParam(key, value);
            }
        } else {
            for (const key of Object.keys(searchOrParsedUrlQuery)) {
                const value = searchOrParsedUrlQuery[key];
                processQueryParam(key, value);
            }
        }
        // Обрабатываем исключительный случай, когда не найдена ни подпись в параметрах,
        // ни один параметр, начинающийся с "vk_", чтобы избежать
        // излишней нагрузки, образующейся в процессе работы дальнейшего кода.
        if (!sign || queryParams.length === 0) {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
        // Снова создаём запрос в виде строки из уже отфильтрованных параметров.
        const queryString = queryParams
            // Сортируем ключи в порядке возрастания.
            .sort((a, b) => a.key.localeCompare(b.key))
            // Воссоздаём новый запрос в виде строки.
            .reduce((acc, { key, value }, idx) => {
                return acc + (idx === 0 ? '' : '&') + `${key}=${encodeURIComponent(value)}`;
            }, '');

        // Создаём хеш получившейся строки на основе секретного ключа.
        const paramsHash = crypto
            .createHmac('sha256', secretKey)
            .update(queryString)
            .digest()
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=$/, '');

        return paramsHash === sign;


    }

    const launchParams = decodeURIComponent(req.params.params.slice(req.params.params.indexOf('?') + 1));

    const areLaunchParamsValid = verifyLaunchParams(launchParams, clientSecret);

    if (areLaunchParamsValid) {
        next()
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
     

}