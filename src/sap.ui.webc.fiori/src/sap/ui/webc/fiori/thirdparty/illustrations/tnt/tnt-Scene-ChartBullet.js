sap.ui.define(function () { 'use strict';

    var sceneSvg = `<svg width="320" height="240" viewBox="0 0 320 240" id="tnt-Scene-ChartBullet">
    <path fill="var(--sapIllus_BackgroundColor)" d="M251.5877,36.8850924 C269.1157,57.9150924 270.8837,89.1290924 262.4877,116.640092 C254.0917,144.283092 235.5327,168.222092 209.1667,181.052092 C182.6537,193.882092 148.3337,195.601092 118.2857,184.491092 C88.0897,173.381092 62.1657,149.309092 55.6847,121.930092 C49.2037,94.5520924 62.0187,63.6020924 83.8187,41.7790924 C105.4707,19.9550924 136.2557,7.25809236 168.3657,6.20009236 C200.4767,5.14209236 233.9127,15.8550924 251.5877,36.8850924" class="sapIllus_BackgroundColor"/>
    <path fill="var(--sapIllus_Layering2)" d="M160.0411 204.066492L160.0081 204.066492C159.1801 204.047492 158.5221 203.362492 158.5401 202.534492L159.7821 144.814492C159.8001 143.997492 160.4681 143.346492 161.2811 143.346492L161.3141 143.346492C162.1431 143.365492 162.8001 144.050492 162.7821 144.878492L161.5401 202.598492C161.5221 203.416492 160.8541 204.066492 160.0411 204.066492M102.5791 218.145592C102.4641 218.145592 102.3461 218.132592 102.2281 218.104592 101.4231 217.911592 100.9271 217.101592 101.1191 216.295592L115.8781 154.743592C116.0701 153.937592 116.8781 153.439592 117.6861 153.633592 118.4921 153.827592 118.9881 154.636592 118.7961 155.442592L104.0371 216.995592C103.8721 217.683592 103.2571 218.145592 102.5791 218.145592M200.8789 218.145592C200.2019 218.145592 199.5879 217.684592 199.4219 216.998592L184.9129 157.036592C184.7189 156.231592 185.2129 155.420592 186.0189 155.225592 186.8239 155.032592 187.6349 155.526592 187.8289 156.331592L202.3379 216.292592C202.5319 217.097592 202.0379 217.908592 201.2329 218.103592 201.1139 218.131592 200.9949 218.145592 200.8789 218.145592" class="sapIllus_Layering2"/>
    <path fill="var(--sapIllus_ObjectFillColor)" d="M230.2189,158.829392 L76.0999,153.044392 C74.4439,152.982392 73.1519,151.590392 73.2139,149.934392 L77.8039,27.6513924 C77.8659,25.9953924 79.2589,24.7033924 80.9139,24.7653924 L235.0339,30.5503924 C236.6899,30.6123924 237.9809,32.0053924 237.9189,33.6603924 L233.3289,155.944392 C233.2669,157.599392 231.8749,158.891392 230.2189,158.829392" class="sapIllus_ObjectFillColor"/>
    <polygon fill="var(--sapIllus_StrokeDetailColor)" points="77.467 43.533 77.317 42.579 237.422 42.253 236.746 52.915" class="sapIllus_StrokeDetailColor"/>
    <path fill="var(--sapIllus_BrandColorSecondary)" d="M237.0452,48.5602924 L77.5582,42.5742924 C77.3852,42.5672924 77.2492,42.4212924 77.2559414,42.2482924 L77.8042,27.6512924 C77.8662,25.9952924 79.2582,24.7032924 80.9142,24.7652924 L235.0342,30.5502924 C236.6892,30.6122924 237.9812,32.0052924 237.9192,33.6612924 L237.3712,48.2582924 C237.3652,48.4312924 237.2192,48.5672924 237.0452,48.5602924" class="sapIllus_BrandColorSecondary"/>
    <path fill="var(--sapIllus_StrokeDetailColor)" d="M230.2375,158.331197 C230.9135,158.350892 231.5415,158.117892 232.0315,157.663892 C232.5215,157.209892 232.8045,156.592892 232.8295,155.925892 L237.4195,33.6428924 C237.4705,32.2648924 236.3925,31.1018924 235.0155,31.0498924 L80.8955,25.2658924 C80.2225,25.2418924 79.5915,25.4768924 79.1015,25.9308924 C78.6125,26.3848924 78.3285,27.0028924 78.3035,27.6698924 L73.7135,149.952892 C73.6625,151.330892 74.7405,152.493892 76.1175,152.544892 L230.2375,158.331197 Z M230.3325,159.330892 C230.2885,159.330892 230.2445,159.330892 230.2005,159.328892 L76.0805,153.543892 C75.1465,153.509892 74.2815,153.112892 73.6465,152.426892 C73.0105,151.741892 72.6795,150.849892 72.7145,149.915892 L77.3045,27.6328924 C77.3395,26.6978924 77.7365,25.8328924 78.4215,25.1978924 C79.1065,24.5618924 79.9915,24.2298924 80.9335,24.2668924 L235.0525,30.0508924 C235.9875,30.0858924 236.8515,30.4828924 237.4875,31.1678924 C238.1225,31.8528924 238.4535,32.7458924 238.4185,33.6798924 L233.8285,155.962892 C233.7585,157.846892 232.2025,159.330892 230.3325,159.330892 L230.3325,159.330892 Z" class="sapIllus_StrokeDetailColor"/>
    <path fill="var(--sapIllus_BrandColorSecondary)" d="M273.0546 63.8400924L259.7446 70.3780924C259.0916 70.6990924 259.0306 71.6070924 259.6356 72.0120924L271.9526 80.2700924C272.5576 80.6750924 273.3736 80.2740924 273.4226 79.5480924L274.4146 64.7520924C274.4636 64.0260924 273.7076 63.5190924 273.0546 63.8400924M109.0938 11.7384924C108.1338 13.7274924 105.7428 14.5614924 103.7538 13.6014924 101.7648 12.6414924 100.9308 10.2504924 101.8908 8.26149236 102.8508 6.27249236 105.2418 5.43849236 107.2308 6.39849236 109.2198 7.35849236 110.0538 9.74949236 109.0938 11.7384924" class="sapIllus_BrandColorSecondary"/>
    <path fill="var(--sapIllus_BackgroundColor)" d="M215.6607,227.328592 C215.6607,230.642592 188.5737,233.328592 155.1607,233.328592 C121.7477,233.328592 94.6607,230.642592 94.6607,227.328592 C94.6607,224.014592 121.7477,221.328592 155.1607,221.328592 C188.5737,221.328592 215.6607,224.014592 215.6607,227.328592" class="sapIllus_BackgroundColor"/>
    <path fill="var(--sapIllus_ObjectFillColor)" d="M113.8408,35.9861924 C113.1988,37.3151924 111.6018,37.8721924 110.2728,37.2311924 C108.9438,36.5891924 108.3868,34.9921924 109.0278,33.6631924 C109.6698,32.3341924 111.2668,31.7761924 112.5958,32.4181924 C113.9248,33.0591924 114.4828,34.6571924 113.8408,35.9861924" class="sapIllus_ObjectFillColor"/>
    <path fill="var(--sapIllus_StrokeDetailColor)" d="M111.4366,32.6513924 C111.1956,32.6513924 110.9546,32.6913924 110.7196,32.7733924 C110.1716,32.9643924 109.7306,33.3573924 109.4786,33.8803924 C108.9576,34.9593924 109.4126,36.2593924 110.4906,36.7803924 C111.5706,37.3013924 112.8716,36.8483924 113.3906,35.7683924 C113.9116,34.6903924 113.4576,33.3883924 112.3776,32.8683924 C112.0796,32.7233924 111.7586,32.6513924 111.4366,32.6513924 M111.4326,37.9983924 C110.9606,37.9983924 110.4926,37.8913924 110.0546,37.6803924 C109.2916,37.3123924 108.7176,36.6693924 108.4396,35.8693924 C108.1606,35.0693924 108.2096,34.2093924 108.5786,33.4453924 C108.9466,32.6823924 109.5896,32.1083924 110.3896,31.8293924 C111.1896,31.5503924 112.0496,31.5983924 112.8136,31.9673924 C114.3886,32.7283924 115.0516,34.6293924 114.2906,36.2043924 C113.9226,36.9663924 113.2796,37.5413924 112.4796,37.8193924 C112.1366,37.9383924 111.7846,37.9983924 111.4326,37.9983924" class="sapIllus_StrokeDetailColor"/>
    <path fill="var(--sapIllus_ObjectFillColor)" d="M205.9595,39.4976924 C205.3175,40.8266924 203.7205,41.3836924 202.3915,40.7426924 C201.0625,40.1006924 200.5055,38.5036924 201.1465,37.1746924 C201.7885,35.8456924 203.3855,35.2876924 204.7145,35.9296924 C206.0435,36.5706924 206.6015,38.1686924 205.9595,39.4976924" class="sapIllus_ObjectFillColor"/>
    <path fill="var(--sapIllus_StrokeDetailColor)" d="M203.5567 36.1640924C202.7477 36.1640924 201.9707 36.6160924 201.5967 37.3920924 201.0767 38.4700924 201.5307 39.7710924 202.6097 40.2920924 203.6857 40.8130924 204.9887 40.3590924 205.5087 39.2800924 206.0297 38.2020924 205.5767 36.9000924 204.4967 36.3800924 204.1947 36.2330924 203.8727 36.1640924 203.5567 36.1640924M203.5507 41.5100924C203.0797 41.5100924 202.6117 41.4030924 202.1737 41.1920924 200.5987 40.4320924 199.9357 38.5310924 200.6967 36.9560924 201.4577 35.3820924 203.3597 34.7210924 204.9327 35.4790924 205.6957 35.8480924 206.2697 36.4910924 206.5477 37.2910924 206.8277 38.0920924 206.7777 38.9520924 206.4097 39.7160924 206.0407 40.4780924 205.3977 41.0530924 204.5977 41.3310924 204.2557 41.4500924 203.9037 41.5100924 203.5507 41.5100924M131.0743 90.7011924L131.0553 90.7011924 114.4383 90.0781924C114.1623 90.0671924 113.9473 89.8351924 113.9573 89.5591924 113.9683 89.2841924 114.1903 89.0641924 114.4753 89.0781924L131.0933 89.7011924C131.3693 89.7121924 131.5843 89.9441924 131.5743 90.2201924 131.5633 90.4891924 131.3423 90.7011924 131.0743 90.7011924" class="sapIllus_StrokeDetailColor"/>
    <path fill="var(--sapIllus_BrandColorSecondary)" d="M181.6611,92.6223924 L180.1131,133.877392 C180.0861,134.582392 180.6361,135.175392 181.3411,135.202392 L192.3841,135.616392 C193.0891,135.643392 193.6821,135.093392 193.7081,134.388392 L195.2571,93.1323924 C195.2831,92.4273924 194.7331,91.8343924 194.0281,91.8083924 L182.9861,91.3933924 C182.2811,91.3673924 181.6871,91.9173924 181.6611,92.6223924" class="sapIllus_BrandColorSecondary"/>
    <path fill="var(--sapIllus_BackgroundColor)" d="M116.3066,100.758792 L115.0986,132.949792 C115.0716,133.654792 115.6216,134.248792 116.3266,134.274792 L127.3696,134.688792 C128.0746,134.715792 128.6676,134.165792 128.6946,133.460792 L129.9026,101.268792 C129.9286,100.563792 129.3786,99.9707924 128.6736,99.9447924 L117.6316,99.5297924 C116.9266,99.5037924 116.3326,100.053792 116.3066,100.758792" class="sapIllus_BackgroundColor"/>
    <path fill="var(--sapIllus_AccentColor)" d="M159.0582,90.2611924 L157.3962,134.538192 C157.3702,135.243192 157.9202,135.836192 158.6252,135.862192 L169.6672,136.277192 C170.3722,136.303192 170.9652,135.753192 170.9922,135.048192 L172.6542,90.7711924 C172.6802,90.0661924 172.1302,89.4731924 171.4252,89.4471924 L160.3832,89.0321924 C159.6782,89.0061924 159.0842,89.5561924 159.0582,90.2611924" class="sapIllus_AccentColor"/>
    <path fill="var(--sapIllus_StrokeDetailColor)" d="M206.2627,142.516592 L105.5507,138.664592 L108.5877,57.5885924 C108.5977,57.3135924 108.3827,57.0805924 108.1067,57.0705924 C107.8567,57.0725924 107.5987,57.2765924 107.5877,57.5515924 L104.532337,139.125592 C104.532337,139.125592 104.532337,139.125592 104.532337,139.125592 L104.532337,139.126592 L104.532337,139.126592 C104.5277,139.254592 104.5747,139.369592 104.6507,139.461592 C104.6567,139.468592 104.6587,139.478592 104.6657,139.485592 C104.6707,139.490592 104.6777,139.493592 104.6837,139.498592 C104.7687,139.583592 104.8827,139.640592 105.0127,139.645592 L206.2237,143.516592 L206.2427,143.516592 C206.5107,143.516592 206.7327,143.304592 206.743035,143.036592 C206.7527,142.759592 206.5377,142.527592 206.2627,142.516592" class="sapIllus_StrokeDetailColor"/>
    <path fill="var(--sapIllus_Layering2)" d="M138.6463,69.8290924 L136.2473,133.744092 C136.2213,134.449092 136.7713,135.042092 137.4763,135.069092 L148.5183,135.483092 C149.2233,135.509092 149.8163,134.959092 149.8433,134.254092 L152.2423,70.3390924 C152.2683,69.6340924 151.7183,69.0410924 151.0133,69.0150924 L139.9713,68.6000924 C139.2663,68.5740924 138.6723,69.1240924 138.6463,69.8290924" class="sapIllus_Layering2"/>
    <path fill="var(--sapIllus_StrokeDetailColor)" d="M151.6563 106.601592L151.6373 106.601592 136.5323 106.035592C136.2563 106.024592 136.0413 105.791592 136.0513 105.516592 136.0613 105.241592 136.2943 105.014592 136.5693 105.035592L151.6753 105.601592C151.9513 105.612592 152.1663 105.844592 152.1563 106.120592 152.1453 106.389592 151.9243 106.601592 151.6563 106.601592M174.7129 96.8779924L174.6939 96.8779924 158.0769 96.2539924C157.8009 96.2429924 157.5859 96.0109924 157.5959 95.7349924 157.6079 95.4599924 157.8499 95.2619924 158.1139 95.2539924L174.7319 95.8779924C175.0079 95.8889924 175.2229 96.1209924 175.2129 96.3969924 175.2019 96.6659924 174.9809 96.8779924 174.7129 96.8779924M197.9395 82.6220924L197.9205 82.6220924 181.3035 81.9980924C181.0275 81.9870924 180.8125 81.7550924 180.8225 81.4790924 180.8335 81.2040924 181.0915 80.9980924 181.3405 80.9980924L197.9585 81.6220924C198.2345 81.6330924 198.4495 81.8650924 198.4395 82.1410924 198.4285 82.4100924 198.2075 82.6220924 197.9395 82.6220924" class="sapIllus_StrokeDetailColor"/>
</svg>`;

    return sceneSvg;

});
