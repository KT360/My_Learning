var i_sentence =  'Will Jhon spot Mary';

var pool = {nouns: ['Jhon', 'Mary', 'Will','Spot'], models:['can','will'], verbs:['spot','see','pat']};

var dic = {};

var taggedSentences = [
    ['S','N:Mary','M:will','V:spot','N:Jhon','E'],
    ['S','M:Will','N:Jhon','V:spot','N:Mary','E']
]

var coresp = 
{
    'N':0,
    'M':1,
    'V':2,
    'E':3
}


//parse through tagged senteces using same format as emissions table
//Four places in each array = N,M,V,E
function getTransitions(sentences)
{
    var dic = 
    {
        'S':[0,0,0,0],
        'N':[0,0,0,0],
        'M':[0,0,0,0],
        'V':[0,0,0,0]
    }

    let keys = Object.keys(dic);

    for(let k = 0; k<keys.length; k++)
    {
        let conditions = [keys[k]+'N',keys[k]+'M',keys[k]+'V',keys[k]+'E']; //create list of conditions

        for(let i = 0; i<sentences.length; i++)
        {
            let sentence = sentences[i];

            for(let j = 0; j<sentence.length-1; j++)
            {
                //get curr element tag as well as next and add them together
                let curr = sentence[j].charAt(0);
                let next = sentence[j+1].charAt(0);
                let cond = curr+next;

                //if conditions include the formed element that means we have a transition for that key
                if(conditions.includes(cond))
                {
                    //get the index to increment depending on the transition
                    let index = coresp[next];
                    dic[curr][index] += 1;//increment the transition for the key
                }

            }
        }

        //Compute and arrange the probabilities for each transition
        let arr = dic[keys[k]];
        let sum = arr.reduce((pSum, a) =>  pSum+a , 0);
        dic[keys[k]] = arr.map( (e) => {
           return e = e/sum;
        });
    }



    return dic;
    
}



//Try to think in step by step detail*****
function getAsArray(pool)
{
    let new_nns = pool.nouns.map( (n) => {
        return n.toLowerCase();
    });

    let new_pool = new_nns.concat(pool.models).concat(pool.verbs);

    for(let i=new_pool.length-1; i>= 0; i--)
    {
        let word = new_pool[i];

        for(let j=i-1; j>= 0; j--)
        {
            if(word === new_pool[j])
            {
                new_pool.splice(j,1);
            }
        }
    }

    return new_pool;

}


//create dic
//with each unique word as key
//key points to an array of three numbers
//where emmisivity for noun, model and verb are


function getEm(array, pool)
{
    let dic = {};
    array.forEach(element => {

        let noun_c = 0;
        let noun_e = 0;
        let model_c = 0;
        let model_e = 0;
        let verb_c = 0;
        let verb_e = 0;


        dic[element] = [];


        pool.nouns.forEach( e => {
            if(e.toLowerCase() === element)
            {
                noun_c++;
            }
        });
        pool.models.forEach( e => {
            if(e.toLowerCase() === element)
            {
                model_c++;
            }
        });
        pool.verbs.forEach( e => {
            if(e.toLowerCase() === element)
            {
                verb_c++;
            }
        });

        noun_e = noun_c/pool.nouns.length;
        dic[element].push(noun_e);

        model_e = model_c/pool.models.length;
        dic[element].push(model_e);

        verb_e = verb_c/pool.verbs.length;
        dic[element].push(verb_e);

    });

    return dic;

}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}


//return series of tags as a array of strings

//Wrap sentence with S and E tags
//start from first word
//Create [N,M,V] array
//word.tolowerCase
//use word as key to get emissivities
//if there is a zero remove corresponding index fomr NMV array
//get transitions of previous word
//if all transitions are zero remove coressponding index fomr NMV array

function getTags(sentence)
{
    var arr = sentence.split(' ');
    arr.unshift('S');
    arr.push('E');
    var em = getEm(getAsArray(pool), pool);
    var tran = getTransitions(taggedSentences);
    var f_tags = {'S':['S']};

    for(let i = 1; i<arr.length-1; i++)
    {
        let word = arr[i].toLowerCase();
        let available = ['N', 'M', 'V'];
        let ems = em[word];
        let prev_word = '';
        //console.log(word+'/'+ems);

        if( i === 1)
        {
            prev_word = 'S'
        }else
        {
            prev_word = arr[i-1].toLowerCase();
        }
        
        let ems_to_remove = [];

        //remove coresponding emisivity
        for( let j = 0; j<ems.length; j++)
        {
            if(ems[j] === 0)
            {
                ems_to_remove.push(getKeyByValue(coresp, j));
            }
        }


        ems_to_remove.forEach( (e) =>  {
            available = available.filter( tag => tag != e);
        });

        //get valid tags for the prior word
        let prior = f_tags[prev_word];
        let to_remove = [];

        //check if all of the prior tags have a transition of 0 relative to current tags
        available.forEach( (t) => {
            let index = coresp[t];
            let counter = 0;
            prior.forEach( (e) => {
                let prior_trans = tran[e];
                if(prior_trans[index] === 0)
                {
                    counter++;
                }
            });
            if(counter === prior.length)
            {
                to_remove.push(t);
            }
        });

        //if so remove tag from list
        to_remove.forEach( (e) =>  {
            available = available.filter( tag => tag != e);
        });

        //add the word along with its valid tags to the dictionary
        f_tags[word] = available;
    }

    console.log(f_tags);
    return f_tags;
}

function getPaths(tags)
{
    let keys = Object.keys(tags);
    let total = 1;
    let all_paths = [];

    for(let i = 0; i<keys.length; i++)//Get total number of paths
    {
        total *= tags[keys[i]].length;
    }

    for(let i = 0; i<total; i++)//Create empty arrays that represent total paths
    {
        all_paths.push([]);
    }

    //for each set of nodes keep deviding the total by the number of elements in the array, this gives the amount of times an element should be repeated at once thoughout the array
    //to fill the array of arrays do not stop repeating each node its set amout until its filled all arrays within

    let curr = total;
    for(let i = 0; i<keys.length; i++)
    {
        let nodes = tags[keys[i]];
        let repeat_index = curr/tags[keys[i]].length;
        let position_index = 0;
        curr = repeat_index;
        while(position_index != total )
        {
            nodes.forEach( (n) => {
                for (let j = 0; j<repeat_index; j++)
                {
                    all_paths[position_index].push(n);
                    position_index++;
                }
            });
        }

    }

    all_paths.forEach( (p) =>{
        p.push('E');
    });

    return all_paths;
}

//Input: a list of all possible paths
//Output: a single path array
//first loop: sentence length
//second loop iterates through the lists using sentence index to grab token

//create probabilities array
//calculate probabilities for each path
//create list empty list that will contain unique tokens grab the first one from the list of paths
//When iterating through the paths, check if(token is in list)
//then, delet from list of path and list of probabilities
//restart the loop
//N,M,V,E
function getFinalPath(paths)
{
    let trans = getTransitions(taggedSentences);
    let ems = getEm(getAsArray(pool),pool);
    let words = i_sentence.split(' ');
    words.push('E');
    words.unshift('S');
    let sentence_length = words.length;
    let probabilities = [];

    for(let i = 1; i<sentence_length; i++)
    {
        let uniques = {};

        for(let j = 0; j<paths.length; j++)//get current total prob. based on current token
        {
            let token = paths[j][i];
            let prev = paths[j][i-1];
            let index = coresp[token];
            let transition = trans[prev][index];

            let word = words[i];
            let em = ems[word][index];

            let probability = transition*em;
            
            if(probabilities.length === 0)
            {
                probabilities.push(probability);
            }else
            {
                probabilities[j]+=probability;
            }

        }



        for(let j = 0; j<paths.lenght; j++)//remove path and coresponding probability from the array and reset
        {
            let tokens = Object.keys(uniques);
            let token = paths[j][i];
            if(tokens.length !=0 && tokens.includes(token))
            {
                let index1 = uniques[token];
                let index2 = j;
                let prob1 = probabilities[index1];
                let prob2 = probabilities[index2]; 

                if(prob1 > prob2)
                {
                    paths.splice(index2,1);
                    probabilities.splice(index2,1);
                }else
                {
                    paths.splice(index1,1);
                    probabilities.splice(index1,1);
                }
            }else
            {
                uniques[token] = j;
            }
        }
    }
}

console.log(getEm(getAsArray(pool),pool));