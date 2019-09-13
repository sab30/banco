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
                    getObj = { min: 0, change : -1 ,max: pageCount ,currentPage: getObj.currentPage };
                }
                if(getObj.min == getObj.currentPage || getObj.currentPage==1){
                    getObj = { min: 0, change : +1 ,max: pageCount ,currentPage: getObj.currentPage };
                }

                getObj.currentPage= getObj.currentPage + getObj.change;

                myCache.set( user_name , getObj, function( err, success ){
                    if( !err && success ){
                         test = myCache.get( user_name );

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

module.exports = router;
