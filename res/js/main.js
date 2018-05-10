const http = new XMLHttpRequest()

var now = new Date();
var month = now.getMonth()+1;
var strmonth = '';
var year = now.getFullYear();
var day = now.getDate();
var strday = '';
var endpoint = 'http://api.aladhan.com/gToH';

if (month < 10) {
    strmonth = '0'+ month.toString();
} else {
    strmonth = month.toString();
}
if (day < 10) {
    strday = '0'+ day.toString();
} else {
    strday = day.toString();
}

var today = strday + '-' + strmonth + '-' + year.toString();

console.log (today);

http.open("GET", endpoint+'?date='+today);
http.send();

http.onload = () => {
    res = JSON.parse(http.responseText);
    console.log(res);
    if(res.code == 200) {
        if(res.data.hijri.month.number <= 9) {
            console.log ("This hijri month is", res.data.hijri.month.number);
            http.open("GET", 'http://api.aladhan.com/hToG'+'?date=01-09-'+ res.data.hijri.year);
            http.send();
            http.onload = () => {
                res = JSON.parse(http.responseText);
                console.log(res);
                var split = res.data.gregorian.date.split('-');
                console.log("Split", split);
                var date1 = new Date(now);
                var date2 = new Date(split[2], split[1]-1, split[0]);
                var timeDiff = date2.getTime() - date1.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                console.log("Day1", date1);
                console.log("Day2", date2);
                console.log(diffDays);
                var element = document.getElementById('days-to-go');
                if(diffDays>0) {
                    element.innerHTML = "<h2>" + diffDays + " days to go </h2> <span class='sub-text'> +/- 1 day depending on the sighting of the moon.</span> <br> <span class='sub-text'> Will be on "+ date2.toDateString() +"<span>";
                } else if (diffDays<0) {
                    diffDays = Math.abs(diffDays);
                    element.innerHTML = "<h2>" + diffDays + " days ago </h2> <span class='sub-text'> +/- 1 day depending on the sighting of the moon.</span> <span class='sub-text'> Was on "+ date2.toDateString() +"<span>";
                } else if (diffDays==0) {
                    element.innerHTML = "<h2> It is today </h2> <span class='sub-text'> Or yesterday or tomorrow depending on the sighting of the moon. </span> <span class='sub-text'> Is on "+ date2.toDateString() +"<span>";
                }
            }
        }  else {
            console.log ("This hijri month is", res.data.hijri.month.number);
            var tmphijri = parseInt(res.data.hijri.year)+1;
            http.open("GET", 'http://api.aladhan.com/hToG'+'?date=01-09-'+ tmphijri);
            http.send();
            http.onload = () => {
                res = JSON.parse(http.responseText);
                console.log(res);
                var split = res.data.gregorian.date.split('-');
                console.log("Split", split);
                var date1 = new Date(now);
                var date2 = new Date(split[2], split[1]-1, split[0]);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                console.log("Day1", date1);
                console.log("Day2", date2);
                console.log(diffDays);
                var element = document.getElementById('days-to-go');
                element.innerHTML = "<h2>" + diffDays + " days to go </h2> <span class='sub-text'> +/- 1 day </span> <span class='sub-text'> Will be on "+ date2.toDateString() +"<span>";
            }
        }

    } else {
        alert ("Oops. Something went wrong");
    }
};