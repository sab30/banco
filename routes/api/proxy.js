const express = require('express');
const router = express.Router();
const request = require('request');
const jwt = require('jsonwebtoken');
const config = require('config');
let fs = require("fs");
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100000, checkperiod: 120000 } );
const auth = require('../../middleware/auth');
// @route    GET api/proxy
// @desc     GET pagination based 
// @access   Public


router.get('/', auth ,async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.user.user_name}/repos?per_page=300&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
          };
      
        request(options, (error, response, body) => {

            obj = JSON.parse(body);
           // console.log(obj.length);

            // res.send(body);        
            pageCount= Math.ceil(obj.length / 30 );
            // console.log(pageCount);
            // let arr = [];
            // for(i=0 ; i < pageCount ; i++){
            //     arr[i] = i;
            // }
            // console.log('arr');
            // console.log(arr);
            // user_name='dutt23';
           
            // Check for the users value     
            value = myCache.get( req.user.user_name );
            console.log(value);
            let page = null;
            if ( value == undefined ){
                obj = { min: 0, change : +1 ,max: pageCount ,currentPage:0};
                myCache.set( req.user.user_name , obj, function( err, success ){
                if( !err && success ){
                    value = myCache.get( req.user.user_name );
                    console.log(value);
                    //return res.json({ method : 'set' , value : value});
                }
                });

            }
                getObj = value;
                if(getObj.max == getObj.currentPage){
                    getObj = { min: 0, change : -1 ,max: pageCount ,currentPage: getObj.currentPage };
                }
                if(getObj.min == getObj.currentPage || getObj.currentPage==1){
                    getObj = { min: 0, change : +1 ,max: pageCount ,currentPage: getObj.currentPage };
                }

                getObj.currentPage= getObj.currentPage + getObj.change;

                myCache.set( req.user.user_name , getObj, function( err, success ){
                    if( !err && success ){
                         test = myCache.get( req.user.user_name );

                         const options = {
                            uri: `https://api.github.com/users/${req.user.user_name}/repos?page=${getObj.currentPage}&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
                            method: 'GET',
                            headers: { 'user-agent': 'node.js' }
                          };
                        request(options, (error, response, body) => {
                            res.json({ githubrepos: JSON.parse(body), page :  getObj.currentPage , value : getObj.currentPage });
                        });
                    }
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
