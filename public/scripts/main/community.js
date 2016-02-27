require([
    'jquery',
    'modules/markItUpSet',
    'markitup',
    // 'bootstrap_tab',
    'bootstrap_dropdown'
], function($,Settings) {

    'use strict';
    
    $('#markItUp').markItUp(Settings);

});
