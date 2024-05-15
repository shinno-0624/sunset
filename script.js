document.addEventListener('DOMContentLoaded', function() {
    // 東京の緯度と経度
    const latitude = 35.630;
    const longitude = 140.168;

    // APIから日の入り時刻を取得
    fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                const sunsetTime = new Date(data.results.sunset).toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo' });
                document.getElementById('sunset-time').innerText = `日の入り時刻: ${sunsetTime}`;

                // 一定の時間（例: 1時間 = 60分 = 3600秒）を引く
                const adjustedDate = new Date(data.results.sunset);
                adjustedDate.setSeconds(adjustedDate.getSeconds() - 2190);  // 1時間引く

                const adjustedTime = adjustedDate.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo' });
                document.getElementById('adjusted-time').innerText = `BGM切り替えの時刻: ${adjustedTime}`;
            } else {
                document.getElementById('sunset-time').innerText = '日の入り時刻を取得できませんでした。';
                document.getElementById('adjusted-time').innerText = '調整後の時刻を表示できません。';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('sunset-time').innerText = 'エラーが発生しました。';
            document.getElementById('adjusted-time').innerText = 'エラーが発生しました。';
        });
});

document.addEventListener('DOMContentLoaded', function() {
    const latitude = 35.630;
    const longitude = 140.168;
    const daysToShow = 7;
    const fetchPromises = [];

    for (let i = 0; i < daysToShow; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        const fetchPromise = fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dateString}&formatted=0`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    const sunsetTime = new Date(data.results.sunset).toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo' });
                    const adjustedDate = new Date(data.results.sunset);
                    adjustedDate.setSeconds(adjustedDate.getSeconds() - 2190);  // 1時間引く
                    const adjustedTime = adjustedDate.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo' });
                    return { date: dateString, sunsetTime, adjustedTime };
                } else {
                    return { date: dateString, sunsetTime: '取得失敗', adjustedTime: '取得失敗' };
                }
            });
        fetchPromises.push(fetchPromise);
    }

    Promise.all(fetchPromises).then(results => {
        let tableHtml = '<table><tr><th>日付</th><th>日の入り時刻</th><th>BGM切り替えの時刻</th></tr>';
        results.forEach(result => {
            tableHtml += `<tr><td>${result.date}</td><td>${result.sunsetTime}</td><td>${result.adjustedTime}</td></tr>`;
        });
        tableHtml += '</table>';
        document.getElementById('result').innerHTML = tableHtml;
    }).catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'エラーが発生しました。';
    });
});
