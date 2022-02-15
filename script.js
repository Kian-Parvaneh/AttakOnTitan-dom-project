const reqMethode = function(callback){
    const request = new XMLHttpRequest();


    request.addEventListener('readystatechange',()=>{
        if(request.readyState===4 && request.status===200)
            callback(undefined , request);
        else if(request.readyState===4)
            callback('error',undefined)
    });

    request.open('GET', 'https://api.tvmaze.com/shows/919/episodes');

    request.send();
}

reqMethode((error,got)=>{
    if(error){
        console.log(error)
    }else{
        creatingMainPage(JSON.parse(got.responseText));
    }
});


function searcher(data){
    const searchBox = document.querySelector('#inputsearch');
    searchBox.addEventListener('keyup',function(){
        if(searchBox.value==''){
            //console.log('runed')
            document.querySelector('#episodeContainer').innerHTML = "";
            data.forEach(el=>Creator(el));
        }
        else if(document.querySelector('#select').value==="Show All"){
            
            const result = data.filter(el=>{
                if(el.summary)
                    return (el.name.toLowerCase().includes(searchBox.value.toLowerCase()) || el.summary.toLowerCase().includes(searchBox.value.toLowerCase()));
                return false;
            });
            document.querySelector('#episodeContainer').innerHTML = "";
            //console.log(result);
            result.forEach(el=>Creator(el));
        }
    })
}

// console.log(data);
const creatingMainPage =function(data){
    eventListenner(data);
    searcher(data);
    //console.log(data);
    for(const el of data) {

        const option = document.createElement('option');
        if(el.season<10)
            el.season='S0'+el.season;
        else
            el.season = 'S'+el.season;
        if(el.number<10)
            el.number='E0'+el.number;
        else
            el.number = 'E'+el.number;        
        option.textContent = el.season+' '+el.number;
        document.querySelector('#select').appendChild(option);
        Creator(el);
    }
    
}

function eventListenner(data){
    
    const select = document.querySelector('#select');
    let seas;
    let epis;
    select.addEventListener('change',function(e){
        e.preventDefault();
        let chosenStr = e.target.value;
        
        seas = chosenStr.split(' ')[0];
        epis = chosenStr.split(' ')[1];
        //console.log(seas,' ',epis);
        const chosenData = data.filter((el)=>el.number==epis && el.season == seas);
        //console.log(chosenData);
        if(chosenData.length===0){
            document.querySelector('#episodeContainer').innerHTML = "";
            data.forEach(el => {
                Creator(el)
            });
        }
        else{
            document.querySelector('#episodeContainer').innerHTML = "";
            Creator(chosenData[0]);
        }
    })
    
}



function Creator(el){
    const link = document.createElement('a');
    const img = document.createElement('img');
    const p = document.createElement('p');
    p.setAttribute('class','name');
    if(el.image)
        img.src = el.image.medium;
    p.textContent = el.name;
    link.href = el.url;
    const detailsP = document.createElement('p');
    detailsP.setAttribute('class','details');
    if(el.summary)
        if(el.summary.split(' ').length>50)
            detailsP.innerHTML = (el.summary.split(' ').slice(0,50)).join(' ')+ '...</p>';
        else
            detailsP.innerHTML = el.summary;
    link.target="_blank";
    link.append(detailsP,img,p)
    document.querySelector('#episodeContainer').appendChild(link);
    hoverEventlistenner(detailsP,link,img,p,el);
}



function hoverEventlistenner(p,link,img,nameAndHour,el){
    let holder;
    link.addEventListener('mouseover',function(){
        p.style.display = 'inline-block';
        holder = nameAndHour.textContent;
        nameAndHour.innerHTML = nameAndHour.textContent+ "<br>" +'Run Time: '+el.runtime
        p.style.color = 'white';
        img.style.opacity = '0.3';
        link.style.backgroundColor = '#a67440';
    })
    link.addEventListener('mouseout',function(){
        p.style.display = 'none';
        img.style.opacity = '1';
        nameAndHour.textContent = holder
        link.style.backgroundColor = 'white';
    })
}