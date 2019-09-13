const express = require('express');
const router = express.Router();
const request = require('request');
const jwt = require('jsonwebtoken');
const config = require('config');
let fs = require("fs");
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100000, checkperiod: 120000 } );
// @route    GET api/proxy
// @desc     GET pagination based 
// @access   Public

function githubURL(){
    return 
    `https://api.github.com/users/bradtraversy/repos?per_page=10&sort=created:asc&client_id=${
        config.get('githubClientId' )
    }&client_secret=${
        config.get('githubSecret')}`
}

router.get('/',async (req, res) => {
     // console.log(gitRepos.grizzly);

    try {   
        
        const options = {
            uri: `https://api.github.com/users/dutt23/repos?per_page=100&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
          };
      
        request(options, (error, response, body) => {

            obj = JSON.parse(body);
            console.log(obj.length);

            // res.send(body);        
            pageCount= Math.ceil(obj.length / 30 );
            console.log(pageCount);
            let arr = [];
            for(i=0 ; i < pageCount ; i++){
                arr[i] = i;
            }
            console.log('arr');
            console.log(arr);
            user_name='dutt23';
           
            // Check for the users value     
            value = myCache.get( user_name );
            console.log(value);
            let page = null;
            if ( value == undefined ){
                obj = { min: 0, change : +1 ,max: pageCount ,currentPage:0};
                myCache.set( user_name , obj, function( err, success ){
                if( !err && success ){
                    value = myCache.get( user_name );
                    console.log(value);
                    //return res.json({ method : 'set' , value : value});
                }
                });

            }
                getObj = value;
                if(getObj.max == getObj.currentPage){
                    page =  getObj.currentPage + getObj.change;
                    getObj = { min: 0, change : -1 ,max: pageCount ,currentPage:0};
                }
                if(getObj.min == getObj.currentPage){
                    page =  getObj.currentPage + getObj.change;
                    getObj = { min: 0, change : +1 ,max: pageCount ,currentPage:0};
                }

                getObj.currentPage= getObj.currentPage + getObj.change;

                myCache.set( user_name , getObj, function( err, success ){
                    if( !err && success ){
                         test = myCache.get( user_name );
                        console.log(test.currentPage)
                    }
                    return res.json({ method : 'get' , value : getObj.currentPage});
                });
        });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);



function proxyTest(){

    const IndexedArray = new Proxy (Array, {
        construct : function (target, [arr]){
            const index ={};

            arr.forEach(item => {
                index[item.id]= item;
            });

            const newArr=  new  target(...arr);

            return new Proxy(newArr, {
                get: function(target, name){
                    if(name ==='push'){
                        return function (item ){
                            index[item.id] = item;
                            return target[name].call(target, name);
                        }

                    }else if(name === 'findById'){
                        return function(id){
                            return index[id];
                        }
                    }

                    return target[name]; 
                }
            })
        }
    })

    const bears = new IndexedArray([
        { id : 1 , name : 'grizzzly'},
        { id : 2 , name : 'black'},
        { id : 3 , name : 'polar'}
    ]);

    bears.push({
        id: 55,
        name : 'brown'
    })
    let repos =new  Proxy(githubURL, {
        proxyErrorHandler: function(err, res, next) {
            console.log(1);
            switch (err && err.code) {
            case 'prev':    { return res.status(200).send('prev'); }
            case 'last':    { return res.status(200).send('last'); }
            case 'first':   { return res.status(200).send('first'); }
            case 'next':    { return res.status(200).send('next'); }
            default:              { next(err); }
            }
        }});

        repos;  
    const brown = bears.findById(1);
    console.log(brown);
    //let bears = { grizzly : true };
    // let repoCount= 0;


    // const gitRepos = new Proxy(bears,{
    //     get : function(target, prop){
    //         if(prop === 'grizzly') repoCount ++;
    //         return target[prop];
    //     }
    // });

    // console.log(gitRepos.grizzly);
    // console.log(gitRepos.grizzly);
    // console.log(gitRepos.grizzly);
    // console.log(gitRepos.grizzly);
    // console.log(repoCount);
    // res.send({loud : loud});


    // const loud = new Proxy(githubAPI, {
    //     apply : function(target, thisArg, args){
    //         return target().toUpperCase() +'!!!';
    //     }
    // });


    //console.log(loud());
}

module.exports = router;
