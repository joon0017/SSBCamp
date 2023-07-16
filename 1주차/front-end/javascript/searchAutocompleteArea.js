(function ($) {
    // �듯빀硫붿씤 �щ�
    var isMain = /^(www|)+(-local|-t|-s)?(-branch)?(\.|)danawa/.test(location.hostname);

    // �먮룞�꾩꽦 �ㅼ썙�� �꾩뿭蹂��� 罹먯떆
    var ack_cache = {};
    // 異붿쿇 移댄뀒怨좊━ �꾩뿭蹂��� 罹먯떆
    var acc_cache = {};

    //�댁쟾�� �뺤씤�� 蹂���
    var checkLastKeyPress = null;

    //�먮룞�꾩꽦 湲곕뒫 �좎�瑜� �꾪빐 �ъ슜�щ�瑜� 荑좏궎�� ����
    var isUsingAKCByCookie = $.cookie('isUsingAKCService');
    if (isUsingAKCByCookie === 'N') {
        isUsingAKCByCookie = false;
    } else {
        isUsingAKCByCookie = true;
    }

    var debounce = function (callback, wait) {
        var timeout;

        return function () {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            clearTimeout(timeout);
            timeout = setTimeout(function () {
                callback.apply(_this, args);
            }, wait);
        };
    };

    var Fn = (autocomplete = function (el, opt) {
        var options = {
            isUsingAKCService: isUsingAKCByCookie, // �먮룞�꾩꽦 �쒕퉬�� �ъ슜 �좊Т.
            isDisplayAKCService: false, // �먮룞�꾩꽦 �쒕퉬�� display �좊Т
            isMyKeywordService: false, // 理쒓렐 寃��됱뼱 �덉씠�� �ъ슜 �щ�
            isAKCArea: false, // 留덉슦�� 而ㅼ꽌 �꾩튂媛� �먮룞�꾩꽦 �곸뿭�몄�.
            akcSourceKeyword: '', // �낅젰 �ㅼ썙��.
            transformAKCSourceKeyword: '', // �먮룞�꾩꽦 蹂��� �ㅼ썙��.
            akcListCurrentLine: 0, // �먮룞�꾩꽦 由ъ뒪�� �쇱씤 �꾩튂
            akcListTotalLine: 0, // �먮룞�꾩꽦 由ъ뒪�� 珥� �쇱씤 ��
            myKeywordCurrentLine: 0, // 理쒓렐 寃��됱뼱 由ъ뒪�� �쇱씤 �꾩튂
            myKeywordTotalLine: 0, // 理쒓렐 寃��됱뼱 由ъ뒪�� 珥� �쇱씤 ��
            akcServiceType: '', // �먮룞�꾩꽦 �쒕퉬�� ���� 援щ텇 : �듯빀寃��� / 硫붿씤 諛� �뱀뀡.
            akcLinkDomain: '', // �먮룞�꾩꽦 �붿껌 �꾨찓��
            akcLinkPathname: '', // �먮룞�꾩꽦 留곹겕 path
            akcLinkUrl: '', // �먮룞�꾩꽦 留곹겕 二쇱냼
            staticUrl: '',
            searchUrl: '',
            gnbCode: 0, // GNB code
            siteCode: 0, // SITE code
            isAkcListTimeout: false,
            recommendCategoryCount: 0, //異붿쿇移댄뀒怨좊━ 媛�닔
            recommendCategoryCurrentLine: 0, //異붿쿇移댄뀒怨좊━ 由ъ뒪�� �쇱씤 �꾩튂
            recommendCategoryHtml: '', //異붿쿇移댄뀒怨좊━ HTML
            recommendCategoryStringLength: 0 //�ъ씠�몃퀎 異붿쿇移댄뀒怨좊━ 臾몄옄�� 媛��� 湲몄씠(�듯빀硫붿씤,�ν꽣,洹몄씠��)
        };

        var selectors = {
            akcSearchForm: null, // 寃��됲뤌
            akcFieldSet: null, // 寃��됲뤌 > �꾨뱶��
            akcContentWrap: null, // �먮룞�꾩꽦 �꾩껜 媛먯떥�� Element(Layer or Iframe),
            akcKeywordInput: null,
            akcKeywordLayer: null,
            akcLayerContent: null, // 寃��됱꽌踰꾩쓽 �먮룞�꾩꽦 �곗씠�� �붿뒪�뚮젅�� �덉씠��
            serviceCtrlLayer: null, // "湲곕뒫�꾧린" 踰꾪듉 �덉씠��
            recomCateLayer: null,
            akcGoodsLayer: null, // �먮룞�꾩꽦 �곹뭹 異쒕젰 �덉씠��
            akcArrowLayer: null,
            iframe: null, // background�� iframe
            searchKeywordLayer: null
        };

        this.arrowOpenClose = {
            className: {
                0: 'auto_arrow_top',
                1: 'auto_arrow_top',
                2: 'auto_arrow_top',
                3: 'auto_arrow_top',
                4: 'auto_arrow_top',
                5: 'auto_arrow_top',
                6: 'auto_arrow_top'
            },
            imageUp: {
                0: '//img.danawa.com/new/newmain/img/btn_auto_up.gif',
                1: '//img.danawa.com/new/newmain/img/btn_auto_up.gif',
                2: '//img.danawa.com/new/newmain/img/btn_auto_up.gif',
                3: '//img.danawa.com/new/newmain/img/btn_auto_up.gif',
                4: '//img.danawa.com/new/newmain/img/btn_auto_up.gif',
                5: '//img.danawa.com/new/newmain/img/btn_auto_up.gif',
                6: '//img.danawa.com/new/newmain/img/btn_auto_up.gif'
            },
            imageDown: {
                0: '//img.danawa.com/new/newmain/img/btn_auto_down.gif',
                1: '//img.danawa.com/new/newmain/img/btn_auto_down.gif',
                2: '//img.danawa.com/new/newmain/img/btn_auto_down.gif',
                3: '//img.danawa.com/new/newmain/img/btn_auto_down.gif',
                4: '//img.danawa.com/new/newmain/img/btn_auto_down.gif',
                5: '//img.danawa.com/new/newmain/img/btn_auto_down.gif',
                6: '//img.danawa.com/new/newmain/img/btn_auto_down.gif'
            }
        };

        selectors.akcSearchForm = el;
        selectors.akcFieldSet = $('>FIELDSET', el);
        selectors.akcKeywordInput = $('input#AKCSearch', selectors.akcFieldSet);
        selectors.akcArrowLayer = $('span.auto_arrow_top', selectors.akcFieldSet);

        this.opt = $.extend(options, opt || {});
        this.sel = selectors;

        this.init();
    });

    Fn.prototype = {
        empty: function () {},

        init: function () {
            var $$ = this;
            var sel = this.sel;
            var opt = this.opt;

            BrowserDetect.init();

            // 愿묎퀬 �ㅼ썙�� �щ�
            var bAdKeyword = false;

            var searchUrl = '//search.danawa.com';
            var isBranch = location.hostname.indexOf('-branch') > -1;
            if (location.hostname.indexOf('-local') > -1) {
                searchUrl = '//search-local.danawa.com';
            } else if (location.hostname.indexOf('-t') > -1) {
                searchUrl = isBranch ? '//search-t-branch.danawa.com' : '//search-t.danawa.com';
            } else if (location.hostname.indexOf('-s') > -1) {
                searchUrl = '//search-s.danawa.com';
            }
            opt.searchUrl = searchUrl;

            $(function () {
                $(this).on('keydown', function (event) {
                    $$.searchEventkeyHandler(event);
                });

                // 寃��됱갹 �곸뿭 �몄뿉 �대┃�� �먮룞�꾩꽦 �곸뿭 �リ린
                $(document).on('mouseup', function (event) {
                    if (
                        !$('.search .search__box').has(event.target).length &&
                        !$('.auto_complete_area').has(event.target).length
                    ) {
                        $$.akcDisplayControl(0);
                    }
                });
            });

            this.akcLayerCreateLayer();

            // adv_srch_obj : 愿묎퀬 �ㅼ썙��
            if (typeof adv_srch_obj === 'string' && !sel.akcKeywordInput.is(':focus')) {
                bAdKeyword = true;
                sel.akcKeywordInput.val(adv_srch_obj);
            }

            sel.akcKeywordInput
                .on('focus click', function () {
                    if (bAdKeyword) {
                        $(this).val('');

                        $('#srchFRM_TOP').attr('action', opt.searchUrl + '/dsearch.php');

                        $(this).removeClass('search_ad');
                    }

                    bAdKeyword = false;

                    $('.search .search__box').addClass('box--focused');
                })
                .on('blur', function () {
                    $('.search .search__box').removeClass('box--focused');
                });

            // 寃��� 留곹겕
            opt.akcLinkDomain = '//' + location.host;
            if (location.host.indexOf('localhost') > -1) {
                opt.akcServiceType = 'local';
                opt.akcLinkPathname = '/search/dsearch.php';
                opt.akcLinkUrl = `${opt.akcLinkDomain + opt.akcLinkPathname}?query=`;
            } else if (location.host.indexOf('search') > -1) {
                opt.akcServiceType = 'search';
                opt.akcLinkPathname = '/dsearch.php';
                opt.akcLinkUrl = `${opt.akcLinkDomain + opt.akcLinkPathname}?query=`;
            } else if (location.host.indexOf('dmall') > -1) {
                opt.akcServiceType = 'mall';
                opt.akcLinkPathname = '/sale/saleSearchListTotal.php';
                opt.akcLinkUrl = `${opt.akcLinkDomain + opt.akcLinkPathname}?sMarkKetOptFeild=prodN&nLocaleC1=0&k1=`;
            } else if (location.host.indexOf('market') > -1) {
                opt.akcServiceType = 'mall';
                opt.akcLinkDomain = '//dmall.danawa.com';
                opt.akcLinkPathname = '/sale/saleSearchListTotal.php';
                opt.akcLinkUrl = `${opt.akcLinkDomain + opt.akcLinkPathname}?sMarkKetOptFeild=prodN&nLocaleC1=0&k1=`;
            } else if (location.host.indexOf('-local') > -1 || location.host.indexOf('-t') > -1) {
                if (location.host.indexOf('-local') > -1) {
                    opt.akcLinkDomain = '//search-local.danawa.com';
                } else {
                    opt.akcLinkDomain = '//search-t.danawa.com';
                }

                opt.akcServiceType = 'section';
                opt.akcLinkPathname = '/dsearch.php';
                opt.akcLinkUrl = opt.akcLinkDomain + opt.akcLinkPathname + '?k1=';

                if (bAdKeyword) {
                    opt.akcLinkDomain =
                        typeof adv_srch_url === 'string' ? adv_srch_url.replace('http://', 'https://') : '';
                    opt.akcLinkPathname = '';
                }
            } else {
                opt.akcServiceType = 'section';
                opt.akcLinkDomain = '//search.danawa.com';
                opt.akcLinkPathname = '/dsearch.php';
                opt.akcLinkUrl = opt.akcLinkDomain + opt.akcLinkPathname + '?k1=';

                if (bAdKeyword) {
                    opt.akcLinkDomain =
                        typeof adv_srch_url === 'string' ? adv_srch_url.replace('http://', 'https://') : '';
                    opt.akcLinkPathname = '';
                }
            }

            opt.staticUrl = '//static.danawa.com';
            if (location.hostname.indexOf('-local') > -1) {
                opt.staticUrl = '//static-local.danawa.com';
            } else if (location.hostname.indexOf('-t') > -1) {
                opt.staticUrl = '//static-t.danawa.com';
            } else if (location.hostname.indexOf('-s') > -1) {
                opt.staticUrl = '//static-s.danawa.com';
            }

            // submit check
            $(sel.akcSearchForm)
                .attr({
                    method: 'GET',
                    action: opt.akcLinkDomain + opt.akcLinkPathname
                })
                .on('submit', function () {
                    var isKeywordValid = $$.checkKeywordValidation();
                    if (!isKeywordValid) {
                        alert('2�� �댁긽 �ㅼ썙�쒕� �낅젰�섏꽭��.');
                        sel.akcKeywordInput.blur();
                        return false;
                    } else {
                        if (opt.gnbCode == 6 || opt.gnbCode == 7) {
                            return $$.doSearch();
                        } else {
                            return $$.doSubmit();
                        }
                    }
                });

            // �먮룞�꾩꽦 �リ린/�닿린
            opt.arrowImg1 = '<a href="#"><span class="btn_auto_open">�먮룞�꾩꽦 �リ린</span></a>';
            opt.arrowImg2 = '<a href="#"><span class="btn_auto_close">�먮룞�꾩꽦 �닿린</span></a>';

            $(sel.akcArrowLayer)
                .addClass($$.arrowOpenClose.className[opt.gnbCode])
                .toggle(
                    function () {
                        $$.akcDisplayControl(1);
                    },
                    function () {
                        $$.akcDisplayControl(0);
                    }
                )
                .show();

            // 寃곌낵�� 寃��� 泥댄겕 �щ�
            $(':checkbox#result_search').on('click', function () {
                var beforeKeyword = ($('input#beforeKeyword').val() || '').trim();

                if ($(this).attr('checked')) {
                    sel.akcKeywordInput.val('').focus();
                } else {
                    sel.akcKeywordInput.val(beforeKeyword).focus();
                }
            });

            var keyEvent = 'keyup';
            if (BrowserDetect.browser === 'Opera') {
                keyEvent = 'keypress';
            } else if (BrowserDetect.browser === 'Explorer') {
                keyEvent = 'keydown';
            }

            sel.akcKeywordInput
                .attr('autocomplete', 'off')
                .on('mousedown', function () {
                    $$.AKCOpenClose();

                    $$.trkEventLog(isMain ? '21�듯빀寃���_�먮룞�꾩꽦_諛곕꼫�몄텧' : '�듯빀寃���_global_�먮룞�꾩꽦_諛곕꼫�몄텧');
                })
                .on(keyEvent, function (event) {
                    $$.akcKeyEventAction(event);
                })
                .on('blur', function () {
                    $$.AKCFocusOut();
                });

            //�뚰룺 �쒓� �낅젰 �대깽�� �숈옉�섏� �딆븘 諛섎났�몃━嫄� 泥섎━ - �ㅼ썙�쒓� 媛숈쓣�뚮뒗 �몄텧�섏� �딆쓬
            if (BrowserDetect.browser === 'Firefox') {
                setInterval(function () {
                    if (opt.akcSourceKeyword !== sel.akcKeywordInput.val()) {
                        opt.akcSourceKeyword = sel.akcKeywordInput.val();
                        sel.akcKeywordInput.filter('[value!=""]:focus').trigger('keyup');
                    }
                }, 1000);
            }
        },

        // �쇰컲�곸씤 search.danawa.com�� submit
        doSubmit: function () {
            var sel = this.sel;

            var inputKeyword = (sel.akcKeywordInput.val() || '').trim();

            // �먮룞�꾩꽦 諛붾줈媛�湲곗씤 寃쎌슦 �덉쇅
            if ($('#akcSearchResult_0').length && $('#akcSearchResult_0').is('.shortcut_url.hover')) {
                return false;
            } else if (inputKeyword === '') {
                alert('寃��됱뼱瑜� �낅젰�� 二쇱꽭��.');

                sel.akcKeywordInput.val('').focus();

                return false;
            }
            return true;
        },

        // search.danawa.com�� submit
        doSearch: function () {
            var sel = this.sel;

            var inputKeyword = (sel.akcKeywordInput.val() || '').trim();

            // �먮룞�꾩꽦 諛붾줈媛�湲곗씤 寃쎌슦 �덉쇅
            if ($('#akcSearchResult_0').length && $('#akcSearchResult_0').is('.shortcut_url.hover')) {
                return false;
            } else if (inputKeyword === '') {
                alert('寃��됱뼱瑜� �낅젰�� 二쇱꽭��.');

                sel.akcKeywordInput.val('').focus();

                return false;
            } else {
                var tab = $('#tab').val();
                // �� �좏깮�� �곕Ⅸ �≪뀡 �좏깮
                if (($('#tab', sel.akcSearchForm).val() || '').trim() === '' || tab !== 'tour') {
                    $('#tab', sel.akcSearchForm).val('main');
                }

                // 湲곕낯 寃��됱씪 寃쎌슦 �듭뀡 遺�遺� 媛� ��젣
                if ($('#isOptionSearch', sel.akcSearchForm).val() !== 'Y') {
                    if (tab === 'tour') {
                        //�ы뻾�� 寃곌낵�� 寃��됱떆 �댁쟾 �뚮씪誘명꽣 �좎�
                        // 寃곌낵�� 寃���
                        if ($(':checkbox#result_search').attr('checked')) {
                            $('input#addSearchKeyword').val(inputKeyword);
                            sel.akcKeywordInput.val($('input#beforeKeyword').val() + ' ' + inputKeyword);
                        } else {
                            $(
                                '#list, #cate_c1, #cate_c2, #cate_c3, #cate_c4, #cate_c5, #minPrice, #maxPrice, #sort, #result_search, #beforeKeyword, #partnerId, #volumeType',
                                sel.akcSearchForm
                            ).attr('disabled', true);
                        }
                    } else {
                        $(
                            '#list, #cate_c1, #cate_c2, #cate_c3, #cate_c4, #cate_c5, #minPrice, #maxPrice, #sort, #result_search, #beforeKeyword, #partnerId, #volumeType',
                            sel.akcSearchForm
                        ).attr('disabled', true);
                        // 寃곌낵�� 寃���
                        if ($(':checkbox#result_search').attr('checked')) {
                            $('input#addSearchKeyword').val(inputKeyword);
                            sel.akcKeywordInput.val($('input#beforeKeyword').val() + ' ' + inputKeyword);
                        }
                    }
                } else {
                    $('#isOptionSearch', sel.akcSearchForm).val('');
                }
                return true;
            }
        },

        checkKeywordValidation: function () {
            var sel = this.sel;

            var inputKeyword = (sel.akcKeywordInput.val() || '').trim();
            var keywordLength = inputKeyword.length;

            if (keywordLength < 2) {
                if (keywordLength === 0) {
                    return true;
                } else {
                    var firstChar = inputKeyword.charAt(0);
                    if (firstChar < '媛�' || firstChar > '��') {
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                return true;
            }
        },

        // �먮룞�꾩꽦 李� �앹꽦(Layer)
        akcLayerCreateLayer: function () {
            var $$ = this;
            var opt = this.opt;
            var sel = this.sel;

            var postionObj = $('>DIV:first', sel.akcFieldSet);

            var w = 0;
            var l = 0;
            var t = postionObj.height() + 20;
            var bottomWidth = 580;
            var recomWidth = 0;

            if (opt.gnbCode == 4) {
                // �ν꽣
                w = sel.akcKeywordInput.width() + 39;
                t = postionObj.height() + 25;
                l = 150;
                recomWidth = bottomWidth - 85;
            } else if (opt.gnbCode == 0) {
                //�듯빀硫붿씤
                w = postionObj.width() - 79;
                t = postionObj.height() + 53;
                l = 20;
                recomWidth = bottomWidth + 52;
            } else if (opt.gnbCode == 7) {
                // �듯빀寃��� 媛쒗렪
                w = postionObj.width() - 22;
                t = postionObj.height() + 14;
                l = 18;
                recomWidth = bottomWidth + 52;
            } else {
                w = postionObj.width() - 58;
                l = 15;
                recomWidth = bottomWidth;
            }

            var akcContentWrap = document.createElement('DIV'); // �먮룞�꾩꽦 �꾩껜 媛먯떥�� �덉씠��
            var akcKeywordLayer = document.createElement('DIV'); // �먮룞�꾩꽦 �ㅼ썙�� 由ъ뒪�� 媛먯떥�� �덉씠�� (akcLayerContent + serviceCtrlLayer)
            var akcLayerContent = document.createElement('UL'); // �먮룞�꾩꽦 �ㅼ썙�� �덉씠��
            var serviceCtrlLayer = document.createElement('DIV');
            var searchKeywordLayer = document.createElement('DIV'); // 理쒓렐 寃��됱뼱 �덉씠��
            var akcGoodsLayer = document.createElement('DIV'); // �먮룞�꾩꽦 �곹뭹 異쒕젰 �덉씠��
            var recomCateLayer = document.createElement('DIV'); // 異붿쿇移댄뀒怨좊━ 異쒕젰 �덉씠��

            $(serviceCtrlLayer)
                .attr('id', 'switch_autocomplete')
                .addClass('func_opt')
                .append(
                    '<a href="" class="com_gnb keyword_all_delete" ' +
                        (opt.isUsingAKCService ? '' : 'style="display: none;"') +
                        '>�꾩껜 ��젣</a>'
                )
                .append(
                    '<a href="" id="function_switch_keyword" class="com_gnb auto_function_switch">' +
                        (opt.isUsingAKCService ? '�먮룞�꾩꽦 �꾧린' : '湲곕뒫耳쒓린') +
                        '</a>'
                )
                .on('click', '.keyword_all_delete, .auto_function_switch', function (event) {
                    event.preventDefault();

                    if (this.classList.contains('keyword_all_delete')) {
                        $$.setCookieMySearchKeyword(null);
                    } else if (this.classList.contains('auto_function_switch')) {
                        $$.akcServiceControl();
                    }
                });

            // 理쒓렐 寃��됱뼱 異쒕젰
            $(searchKeywordLayer).attr('id', 'mySearchKeywordBlockArea').hide();

            // �먮룞�꾩꽦 �ㅼ썙�� 遺�遺� 媛먯떥湲�
            $(akcKeywordLayer)
                .attr('id', 'akcLayer')
                .addClass('auto_word_list')
                .append($(akcLayerContent))
                .append($(searchKeywordLayer))
                .append($(serviceCtrlLayer));

            // �먮룞�꾩꽦 �곹뭹
            $(akcGoodsLayer).addClass('auto_product_list').append(`
                <ul id="auto_goods_list" class="auto_goods_list" style="display: none;"></ul>
                <ul id="auto_banner_layer" class="goods_banner">
                    <li>
                        <iframe 
                            width="300" 
                            height="250"
                            marginheight="0" 
                            marginwidth="0"
                            title="�먮룞�꾩꽦 愿묎퀬�곸뿭" 
                            scrolling="no" 
                            frameborder="0" 
                            src="//ad.danawa.com/RealMedia/ads/adstream_sx.ads/www.danawa.com/main@Top1"
                        ></iframe>
                    </li>
                </ul>
            `);

            // �먮룞�꾩꽦 �꾩껜 媛먯떥湲�
            $(akcContentWrap)
                .attr({ id: 'auto_area2', class: 'auto_complete_area' })
                .append($(akcKeywordLayer))
                .append($(akcGoodsLayer))
                .append($(recomCateLayer))
                .on('mouseenter mouseleave', function (event) {
                    if (event.type === 'mouseenter') {
                        opt.isAKCArea = true;
                    } else if (event.type === 'mouseleave') {
                        opt.isAKCArea = false;
                    }
                })
                .hide();

            $(sel.akcFieldSet).append(akcContentWrap);

            // �꾩뿭蹂��섏뿉 �대뒗��.
            sel.akcContentWrap = akcContentWrap;
            sel.akcKeywordLayer = akcKeywordLayer;
            sel.akcLayerContent = akcLayerContent;
            sel.akcGoodsLayer = akcGoodsLayer;
            sel.serviceCtrlLayer = serviceCtrlLayer;
            sel.recomCateLayer = recomCateLayer;
            sel.searchKeywordLayer = searchKeywordLayer;
        },

        //�먮룞�꾩꽦 �낅젰 �� �대깽�� 泥섎━
        akcKeyEventAction: function (event) {
            var opt = this.opt;
            var sel = this.sel;
            var $$ = this;

            var akcItem = null;
            var insertKeyCode = event.keyCode;

            // esc key : close akc window
            if (insertKeyCode === 27) {
                opt.isAKCArea = false;
                $$.akcDisplayControl(0);
                return;
            }

            // akc 李쎌씠 �대젮�덉� �딅떎硫�  open
            if (!opt.isDisplayAKCService) {
                $$.akcDisplayControl(1);
            }

            // tab key : non action
            if (insertKeyCode === 9) {
                event.returnValue = false;
                return;
            }

            var tagRemovedKeyword = '';

            // key down : move down
            if (insertKeyCode === 40) {
                if (opt.isMyKeywordService) {
                    // 理쒓렐 寃��됱뼱
                    if (opt.myKeywordTotalLine > 0) {
                        //�댁쟾�ㅺ� move up�쇰븣 泥섎━(�덊븯硫� �먮쾲�뚮윭�� �섏씠�쇱씠�� �대룞)
                        if (checkLastKeyPress === 2) {
                            ++opt.myKeywordCurrentLine;
                        }

                        if (opt.myKeywordCurrentLine > opt.myKeywordTotalLine) {
                            opt.myKeywordCurrentLine = 1;
                        }

                        akcItem = $('#mySearchKeywordListArea li').eq(opt.myKeywordCurrentLine - 1);

                        // 理쒓렐 寃��됱뼱 媛쒕퀎��젣瑜� �� �� �덇린 �뚮Ц�� id濡� �좏깮�섏� 留먭퀬 eq濡� �몃뱶瑜� �좏깮�댁빞��
                        $$.akcHighlight(akcItem, true);

                        // �ㅼ썙�� �낅젰
                        tagRemovedKeyword = $$.removeStrongTag(akcItem.attr('text'));

                        if (tagRemovedKeyword !== '') {
                            sel.akcKeywordInput.val(tagRemovedKeyword);
                        }

                        opt.myKeywordCurrentLine++;
                        checkLastKeyPress = 1;
                    }
                } else if (opt.isDisplayAKCService) {
                    // �먮룞�꾩꽦
                    if (opt.akcListTotalLine > 0) {
                        //�댁쟾�ㅺ� move up�쇰븣 泥섎━(�덊븯硫� �먮쾲�뚮윭�� �섏씠�쇱씠�� �대룞)
                        if (checkLastKeyPress === 2) {
                            ++opt.akcListCurrentLine;
                        }

                        if (opt.akcListCurrentLine > opt.akcListTotalLine) {
                            opt.akcListCurrentLine = 1;
                        }

                        akcItem = $('[id^="akcSearchResult_"]').eq(opt.akcListCurrentLine - 1);
                        opt.recommendCategoryCurrentLine = opt.akcListCurrentLine;

                        $$.akcHighlight(akcItem, true);

                        // �ㅼ썙�� �낅젰
                        if (akcItem.hasClass('recommandCategory')) {
                            tagRemovedKeyword = $$.removeStrongTag($('#akcSearchResult_1').attr('text'));
                        } else {
                            tagRemovedKeyword = $$.removeStrongTag(akcItem.attr('text'));
                        }

                        if (tagRemovedKeyword !== '') {
                            sel.akcKeywordInput.val(tagRemovedKeyword);
                        }

                        opt.akcListCurrentLine++;
                        $$.makeGoodsListData();
                        checkLastKeyPress = 1;
                    }
                }
            }
            // key up : move up
            else if (insertKeyCode === 38) {
                if (opt.isMyKeywordService) {
                    // 理쒓렐 寃��됱뼱
                    if (opt.myKeywordTotalLine > 0) {
                        //�댁쟾�ㅺ� move down�쇰븣 泥섎━(�덊븯硫� �먮쾲�뚮윭�� �섏씠�쇱씠�� �대룞)
                        if (checkLastKeyPress === 1) {
                            --opt.myKeywordCurrentLine;
                        }
                        opt.myKeywordCurrentLine--;

                        if (opt.myKeywordCurrentLine < 1) {
                            opt.myKeywordCurrentLine = opt.myKeywordTotalLine;
                        }

                        akcItem = $('#mySearchKeywordListArea li').eq(opt.myKeywordCurrentLine - 1);

                        // 理쒓렐 寃��됱뼱 媛쒕퀎��젣瑜� �� �� �덇린 �뚮Ц�� id濡� �좏깮�섏� 留먭퀬 eq濡� �몃뱶瑜� �좏깮�댁빞��
                        $$.akcHighlight(akcItem, true);

                        // �ㅼ썙�� �낅젰
                        tagRemovedKeyword = $$.removeStrongTag(akcItem.attr('text'));

                        if (tagRemovedKeyword !== '') {
                            sel.akcKeywordInput.val(tagRemovedKeyword);
                        }

                        checkLastKeyPress = 2;
                    }
                } else if (opt.isDisplayAKCService) {
                    //�먮룞�꾩꽦
                    if (opt.akcListTotalLine > 0) {
                        //�댁쟾�ㅺ� move down�쇰븣 泥섎━(�덊븯硫� �먮쾲�뚮윭�� �섏씠�쇱씠�� �대룞)
                        if (checkLastKeyPress === 1) {
                            --opt.akcListCurrentLine;
                        }
                        opt.akcListCurrentLine--;

                        if (opt.akcListCurrentLine < 1) {
                            opt.akcListCurrentLine = opt.akcListTotalLine;
                        }

                        akcItem = $('[id^="akcSearchResult_"]').eq(opt.akcListCurrentLine - 1);
                        opt.recommendCategoryCurrentLine = opt.akcListCurrentLine;

                        $$.akcHighlight(akcItem, true);

                        // �ㅼ썙�� �낅젰
                        if (akcItem.hasClass('recommandCategory')) {
                            tagRemovedKeyword = $$.removeStrongTag($('#akcSearchResult_1').attr('text'));
                        } else {
                            tagRemovedKeyword = $$.removeStrongTag(akcItem.attr('text'));
                        }

                        if (tagRemovedKeyword !== '') {
                            sel.akcKeywordInput.val(tagRemovedKeyword);
                        }

                        $$.makeGoodsListData();
                        checkLastKeyPress = 2;
                    }
                }
            } else if (insertKeyCode === 13) {
                var recommendCategoryItem = $('[id^="akcSearchResult_"]').eq(opt.recommendCategoryCurrentLine - 1);
                var shortcutItem = $('[id^="akcSearchResult_0"]');
                var linkUrl = '';

                if (
                    // 異붿쿇移댄뀒怨좊━ �대룞
                    opt.recommendCategoryCount > 0 &&
                    recommendCategoryItem.is('.recommandCategory.hover')
                ) {
                    linkUrl = recommendCategoryItem.find('a').data('url') || '';

                    if (linkUrl) {
                        $$.doUxlogging('A0002-A-AB-0002', {
                            autoComplete: 'category',
                            memberCode: parseInt($('#memberSeq').val()) || undefined
                        });
                        $$.trkEventLog(
                            isMain ? '21�듯빀寃���_�먮룞�꾩꽦_異붿쿇移댄뀒怨좊━' : '�듯빀寃���_global_�먮룞�꾩꽦_異붿쿇移댄뀒怨좊━'
                        );

                        location.href = linkUrl;
                    }
                } else if (
                    // 諛붾줈媛�湲� �대룞
                    shortcutItem.is('.shortcut_url.hover')
                ) {
                    linkUrl = shortcutItem.find('a').data('url') || '';
                    var siteName = shortcutItem.find('.url_title').text();

                    if (linkUrl) {
                        $$.trkEventLog(
                            (isMain ? '21�듯빀寃���_�먮룞�꾩꽦_諛붾줈媛�湲�_' : '�듯빀寃���_global_�먮룞�꾩꽦_諛붾줈媛�湲�_') + siteName
                        );

                        location.href = linkUrl;
                    }
                }
            } else {
                // etc key input action
                opt.akcListCurrentLine = 0;
                opt.akcListTotalLine = 0;
                opt.recommendCategoryCurrentLine = 0;
                opt.recommendCategoryCount = 0;
                checkLastKeyPress = 0;

                $$.akcDisplayControl(1);
            }
        },

        // �먮룞�꾩꽦 李� 而⑦듃濡ㅻ윭.
        // �먮룞�꾩꽦 李� 蹂댁뿬二쇨린/蹂댁뿬二쇱� �딄린�� ���� 湲곕뒫留� �섑뻾.
        // flag : �먮룞�꾩꽦 李� �쒖뼱 �뚮옒洹�. 1�대㈃ display, 0�대㈃ non display.
        akcDisplayControl: function (flag) {
            var sel = this.sel;
            var opt = this.opt;
            var $$ = this;

            if (flag) {
                opt.isDisplayAKCService = true;

                $$.akcArrowDisplay();
                $$.akcDataDisplay();
                $$.showIframe();

                var iframeBanner = $('#auto_banner_layer > li > iframe');
                if (iframeBanner.length && iframeBanner.attr('src') === 'about:blank') {
                    iframeBanner.attr('src', '//ad.danawa.com/RealMedia/ads/adstream_sx.ads/www.danawa.com/main@Top1');
                }

                $(sel.akcContentWrap).show();
            } else if (!flag && (!$('.search .search__box').hasClass('box--focused') || !opt.isUsingAKCService)) {
                opt.isDisplayAKCService = false;

                $$.hideIframe();

                $(sel.akcContentWrap).hide();

                $$.akcArrowDisplay();
            }
        },

        // �먮룞�꾩꽦 arrow 踰꾪듉 而⑦듃濡ㅻ윭. arrow �대�吏� 諛� �대�吏� �대옓 �≪뀡 蹂�寃쎌뿉 ���� 湲곕뒫留� �섑뻾.
        // isDisplayService媛� true�대㈃ �먮룞�꾩꽦 李� 蹂댁뿬二쇱� �딄린�� ���� �≪뀡�쇰줈 蹂�寃�, false�대㈃ 蹂댁뿬二쇨린 �≪뀡�쇰줈 蹂�寃�.
        akcArrowDisplay: function () {
            if (this.opt.isDisplayAKCService) {
                $(this.sel.akcArrowLayer).find('a span').attr('class', 'btn_auto_open').text('�먮룞�꾩꽦 �リ린');
            } else {
                $(this.sel.akcArrowLayer).find('a span').attr('class', 'btn_auto_close').text('�먮룞�꾩꽦 �닿린');
            }
        },

        akcDataDisplay: function () {
            var opt = this.opt;
            var sel = this.sel;
            var $$ = this;

            // �먮룞�꾩꽦 諛� �먮룞�꾩꽦 �덈궡 臾멸뎄 �좏깮
            if (opt.isUsingAKCService) {
                // �먮룞�꾩꽦 �몄텧
                $$.makeAKCData();
            } else {
                // �먮룞�꾩꽦 �덈궡臾멸뎄(湲곕뒫 �꾧린 �곹깭)
                var infoHtml = $$.getAKCInfo(false);
                $(sel.akcLayerContent).html(infoHtml).show();
            }
        },

        makeAKCData: debounce(function () {
            var opt = this.opt;
            var sel = this.sel;
            var $$ = this;

            opt.akcSourceKeyword = (sel.akcKeywordInput.val() || '').trim();

            if (opt.akcSourceKeyword === '') {
                $$.changeSearchedKeywordView(true);
                $$.showIframe();

                return;
            }
            $$.changeSearchedKeywordView(false);

            // �먮룞�꾩꽦
            var akcRequestUrl = '//www.danawa.com';
            var isBranch = location.hostname.indexOf('-branch') > -1;
            if (location.hostname.indexOf('-local') > -1) {
                akcRequestUrl = '//www-local.danawa.com';
            } else if (location.hostname.indexOf('-t') > -1) {
                akcRequestUrl = isBranch ? '//www-t-branch.danawa.com' : '//www-t.danawa.com';
            } else if (location.hostname.indexOf('-s') > -1) {
                akcRequestUrl = '//www-s.danawa.com';
            }

            //dmall�먯꽌 �먮룞�꾩꽦 SIMPLEXML�� �몄텧 �덈릺�� 異붽��곸쑝濡� 蹂��� �ㅼ젙
            var akcReferer = '';
            if (opt.gnbCode == 4) {
                akcReferer = 'dmall';
            }

            var keyword = encodeURIComponent(opt.akcSourceKeyword.replace("'", '||'));

            if (
                typeof ack_cache[keyword] === 'object' &&
                ack_cache[keyword] !== null &&
                Object.keys(ack_cache[keyword]).length > 0
            ) {
                $$.akcSearchResult(ack_cache[keyword]);
            } else {
                $.ajax({
                    type: 'GET',
                    url: akcRequestUrl + '/globaljs/com/danawa/common/searchAutocompleteResult.json.php',
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    cache: false,
                    timeout: 1000,
                    data: {
                        q: decodeURIComponent(keyword),
                        referer: akcReferer
                    },
                    success: function (responseData) {
                        // 罹먯떆 �깅줉(硫붾え�댁젣�댁뀡)
                        ack_cache[keyword] = responseData;

                        $$.akcSearchResult(responseData);
                    }
                });
            }
        }, 100),

        akcSearchResult: function (autoCompleteData) {
            var opt = this.opt;
            var sel = this.sel;
            var $$ = this;

            var autoCompleteResultHtml = '';
            var autoCompleteKeywordData = Array.isArray(autoCompleteData.keyword) ? autoCompleteData.keyword : [];
            var autoCompleteShortcutData = Array.isArray(autoCompleteData.shortcut) ? autoCompleteData.shortcut : [];

            // �먮룞�꾩꽦 諛붾줈媛�湲�
            // �먮룞�꾩꽦�쇰줈 �몄텧�섎룄濡� �ㅼ젙�� �ㅼ썙�쒕쭔 �대떦
            if (autoCompleteShortcutData.length > 0 && autoCompleteShortcutData[0].autocompleteYN === 'Y') {
                autoCompleteResultHtml += `
                    <li id="akcSearchResult_0" class="shortcut_url">
                        <a href="" data-url="${autoCompleteShortcutData[0].linkUrl}">
                            <div class="url_area">
                                <span class="url_logo">${
                                    autoCompleteShortcutData[0].imageUrl
                                        ? `<img 
                                                class="image"
                                                src="${autoCompleteShortcutData[0].imageUrl}&shrink=40:40"
                                                alt=""
                                                onerror="this.onerror=null; this.remove();"
                                            />`
                                        : ''
                                }</span>
                                <span class="url_title">${autoCompleteShortcutData[0].sitename}</span>
                                <span class="url_link">${autoCompleteShortcutData[0].exposureUrl}</span>
                            </div>
                            <span class="etc_text">諛붾줈媛�湲�</span>
                        </a>
                    </li>`;
            }

            // �먮룞�꾩꽦 �ㅼ썙�� & 異붿쿇 移댄뀒怨좊━
            if (autoCompleteKeywordData.length === 0) {
                autoCompleteResultHtml += `
                    <div class="no_result">
                        <p class="auto_word_information">�대떦 �⑥뼱 愿��� 異붿쿇�닿� �놁뒿�덈떎.</p>
                    </div>`;

                $(sel.akcLayerContent).html(autoCompleteResultHtml);

                $$.printBanner(); // 諛곕꼫 異쒕젰
            } else {
                // 理쒓렐 寃��됱뼱 荑좏궎
                var searchKeywordCookieList = $$.getCookieMySearchKeyword();
                // �ㅼ썙��/�좎쭨 遺꾨━
                var keywordList = searchKeywordCookieList.map(function (value) {
                    return value.split('>')[0] || '';
                });
                var dateList = searchKeywordCookieList.map(function (value) {
                    return value.split('>')[1] || '';
                });

                // 泥� 踰덉㎏ �먮룞�꾩꽦 �ㅼ썙��
                var firstKeyword = '';
                if (autoCompleteKeywordData.length > 0 && typeof autoCompleteKeywordData[0] === 'string') {
                    firstKeyword = encodeURIComponent($$.removeStrongTag(autoCompleteKeywordData[0]));
                }

                // �ν꽣, �듯빀硫붿씤, 洹� �댁쇅 �멸린�ㅼ썙�� width 湲몄씠�� �곕Ⅸ 異붿쿇 移댄뀒怨좊━ 臾몄옄�� 湲몄씠 �뺤쓽
                var widthStyle = '';
                if (opt.gnbCode == 4) {
                    widthStyle = ' style="width:115px !important;"';
                    opt.recommendCategoryStringLength = 10;
                } else if (opt.gnbCode == 0) {
                    opt.recommendCategoryStringLength = 35;
                } else {
                    opt.recommendCategoryStringLength = 20;
                }

                // 異붿쿇 移댄뀒怨좊━
                $$.getRecommendCategoryData(firstKeyword).always(function (recommendCategoryData) {
                    if (recommendCategoryData.length > 0) {
                        opt.recommendCategoryCount = recommendCategoryData.length;

                        var recommendCategoryHtml = '';

                        for (var i = 0; i < opt.recommendCategoryCount; i++) {
                            if (!recommendCategoryData[i] || Object.keys(recommendCategoryData[i]).length === 0) {
                                continue;
                            }

                            var linkUrl = recommendCategoryData[i].url;
                            var innerKeyword = recommendCategoryData[i].innerKeyword;

                            if (innerKeyword) {
                                linkUrl += '&searchOption=/innerSearchKeyword=' + encodeURIComponent(innerKeyword);
                            }

                            recommendCategoryHtml += `
                                <li id="akcSearchResult_${i + 2}" class="recommandCategory">
                                    <a href="" data-url="${linkUrl}">`;

                            if (
                                Array.isArray(recommendCategoryData[i].categoryList) &&
                                recommendCategoryData[i].categoryList.length > 0
                            ) {
                                recommendCategoryHtml += '<span class="label_cate">移댄뀒怨좊━</span>';
                                recommendCategoryData[i].categoryList.forEach(function (category) {
                                    recommendCategoryHtml += `<span class="text_cate">${category}</span>`;
                                });
                            }
                            recommendCategoryHtml += '</a></li>';
                        }

                        opt.recommendCategoryHtml = recommendCategoryHtml;
                    } else {
                        opt.recommendCategoryHtml = '';
                        opt.recommendCategoryCount = 0;
                        opt.recommendCategoryCurrentLine = 0;
                    }

                    // �먮룞�꾩꽦 �ㅼ썙�� + 異붿쿇 移댄뀒怨좊━ : 理쒕� 10媛�
                    // �먮룞�꾩꽦 諛붾줈媛�湲� : 理쒕� 1媛�
                    var overCount = 0;
                    if (autoCompleteKeywordData.length + opt.recommendCategoryCount > 10) {
                        overCount = autoCompleteKeywordData.length + opt.recommendCategoryCount - 10;
                    }

                    opt.akcListTotalLine = autoCompleteKeywordData.length + autoCompleteShortcutData.length - overCount;

                    for (var j = 0; j < opt.akcListTotalLine - autoCompleteShortcutData.length; j++) {
                        var line = j + 1;
                        if (line > 1) {
                            line = line + opt.recommendCategoryCount;
                        }

                        var recentKeywordIndex = keywordList.indexOf(autoCompleteKeywordData[j]);

                        // �먮룞�꾩꽦 �ㅼ썙�쒓� 理쒓렐 寃��됱뼱�� �쇱튂�섎뒗 寃쎌슦 �꾩씠肄� �쒖꽦��
                        // �먮룞�꾩꽦 �ㅼ썙�쒓� 理쒓렐 寃��됱뼱�� �쇱튂�섎뒗 寃쎌슦 �좎쭨 �몄텧 (MM.DD.)
                        autoCompleteResultHtml += `
                            <li 
                                id="akcSearchResult_${line}" 
                                class="${recentKeywordIndex > -1 ? 'recent' : ''}" 
                                value="" 
                                text="${autoCompleteKeywordData[j] || ''}" 
                                data-seq="${line}"
                            >
                                <a href="">
                                    <span 
                                        class="auto_keyword_name"
                                        ${widthStyle}
                                    >${$$.getAKCKeywordMatch(autoCompleteKeywordData[j] || '')}</span>
                                </a>
                                <span class="etc">
                                    <em class="date">${
                                        recentKeywordIndex > -1 ? dateList[recentKeywordIndex] + '.' : ''
                                    }</em>
                                    <a href="" role="button" class="btn_word_move">
                                        <span class="blind">寃��됱뼱 �낅젰 �곸뿭�� �낅젰</span>
                                    </a>
                                </span>
                            </li>\n`;

                        if (j === 0 && opt.recommendCategoryCount > 0) {
                            autoCompleteResultHtml += opt.recommendCategoryHtml;
                        }
                    }

                    $(sel.akcLayerContent)
                        .html(autoCompleteResultHtml)
                        .find('li[id^="akcSearchResult_"]')
                        .off('mouseenter mouseleave click')
                        .on('mouseenter mouseleave click', function (event) {
                            if (event.type === 'mouseenter') {
                                opt.akcListCurrentLine =
                                    parseInt(event.currentTarget.id.replace('akcSearchResult_', '')) || 0;
                                $$.akcHighlight(event.currentTarget, true);
                            } else if (event.type === 'mouseleave') {
                                $$.akcHighlight(event.currentTarget, false);
                            } else if (event.type === 'click') {
                                event.preventDefault();

                                var linkUrl = '';
                                if (event.currentTarget.classList.contains('shortcut_url')) {
                                    // �먮룞�꾩꽦 諛붾줈媛�湲�
                                    linkUrl = event.currentTarget.querySelector('a').dataset.url || '';
                                    var siteName = event.currentTarget.querySelector('.url_title').innerText;

                                    if (linkUrl) {
                                        $$.trkEventLog(
                                            isMain
                                                ? '21�듯빀寃���_�먮룞�꾩꽦_諛붾줈媛�湲�_'
                                                : `�듯빀寃���_global_�먮룞�꾩꽦_諛붾줈媛�湲�_${siteName}`
                                        );

                                        location.href = linkUrl;
                                    }
                                } else {
                                    // �먮룞�꾩꽦 �ㅼ썙�� & 異붿쿇 移댄뀒怨좊━
                                    var tagRemovedKeyword = $$.removeStrongTag(
                                        event.currentTarget.getAttribute('text')
                                    );

                                    if (event.target.classList.contains('btn_word_move')) {
                                        // �먮룞 �낅젰 踰꾪듉
                                        sel.akcKeywordInput.val(tagRemovedKeyword).focus();

                                        $$.akcDataDisplay();

                                        $$.trkEventLog(
                                            isMain
                                                ? '21�듯빀寃���_�먮룞�꾩꽦_寃��됱갹�낅젰'
                                                : '�듯빀寃���_global_�먮룞�꾩꽦_寃��됱갹�낅젰'
                                        );
                                    } else if (
                                        opt.recommendCategoryCount > 0 &&
                                        event.currentTarget.classList.contains('recommandCategory')
                                    ) {
                                        // 異붿쿇 移댄뀒怨좊━
                                        linkUrl = event.currentTarget.querySelector('a').dataset.url || '';

                                        if (linkUrl) {
                                            $$.doUxlogging('A0002-A-AB-0002', {
                                                autoComplete: 'category',
                                                memberCode: parseInt($('#memberSeq').val()) || undefined
                                            });
                                            $$.trkEventLog(
                                                isMain
                                                    ? '21�듯빀寃���_�먮룞�꾩꽦_異붿쿇移댄뀒怨좊━'
                                                    : '�듯빀寃���_global_�먮룞�꾩꽦_異붿쿇移댄뀒怨좊━'
                                            );

                                            location.href = linkUrl;
                                        }
                                    } else if (tagRemovedKeyword !== '') {
                                        var typingKeyword = ($(sel.keywordInput).val() || '').trim();

                                        $$.doUxlogging('A0002-A-AB-0001', {
                                            autoComplete: 'keyword',
                                            typingKeyword: typingKeyword,
                                            clickKeyword: tagRemovedKeyword,
                                            memberCode: parseInt($('#memberSeq').val()) || undefined
                                        });
                                        $$.trkEventLog(
                                            isMain ? '21�듯빀寃���_�먮룞�꾩꽦_�ㅼ썙��' : '�듯빀寃���_global_�먮룞�꾩꽦_�ㅼ썙��'
                                        );

                                        location.href = opt.akcLinkUrl + encodeURIComponent(tagRemovedKeyword);
                                    }
                                }
                            }
                        });

                    if (opt.akcListTotalLine > 0) {
                        opt.akcListCurrentLine = 1;
                        $$.makeGoodsListData();
                    }

                    if (opt.recommendCategoryCount > 0) {
                        opt.akcListTotalLine = opt.akcListTotalLine + opt.recommendCategoryCount;
                    }
                });
            }

            $(sel.akcLayerContent).show();

            //媛꾪샊 �띿뒪�� 愿묎퀬媛� �쒕�濡� �쒓굅�섏� �딆븘�� �ㅻ낫�� �대깽�� 諛쒖깮�� �띿뒪�� 愿묎퀬 �쒓굅�섍린 �꾪븳 泥섎━
            if (sel.akcKeywordInput.hasClass('search_ad')) {
                if (typeof adv_srch_obj === 'string') {
                    sel.akcKeywordInput.val(sel.akcKeywordInput.val().replace(adv_srch_obj, ''));
                    sel.akcKeywordInput.removeClass('search_ad');
                }

                $('#srchFRM_TOP').attr('action', `${opt.searchUrl}/dsearch.php`);
            }

            //iframe 諛깃렇�쇱슫�� 泥섎━
            $$.showIframe();
        },

        getRecommendCategoryData: function (firstKeyword) {
            var opt = this.opt;
            var deferred = $.Deferred();

            if (
                acc_cache[firstKeyword] &&
                Array.isArray(acc_cache[firstKeyword]) &&
                acc_cache[firstKeyword].length > 0
            ) {
                // 罹먯떆 議고쉶
                deferred.resolve(acc_cache[firstKeyword]);
            } else {
                $.ajax({
                    type: 'GET',
                    url: opt.staticUrl + '/globalData/searchAKC/acc_UTF8.php',
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    cache: false,
                    timeout: 1000,
                    data: {
                        Name: decodeURIComponent(firstKeyword)
                    },
                    success: function (responseData) {
                        if (responseData && Array.isArray(responseData) && responseData.length > 0) {
                            // 罹먯떆 �깅줉(硫붾え�댁젣�댁뀡)
                            acc_cache[firstKeyword] = responseData;

                            deferred.resolve(responseData);
                        } else {
                            deferred.reject([]);
                        }
                    },
                    error: function () {
                        deferred.reject([]);
                    }
                });
            }

            return deferred.promise();
        },

        showIframe: function () {
            var opt = this.opt;
            var sel = this.sel;

            if (!opt.isDisplayAKCService) {
                this.hideIframe();
                return false;
            }

            var w = `${$(sel.akcContentWrap).width()}px`;
            var h = `${$(sel.akcContentWrap).height() - 1}px`;

            $(sel.iframe)
                .css({
                    backgroundColor: 'white',
                    width: w,
                    height: h
                })
                .show();

            $(sel.iframe)
                .off('load')
                .on('load', function () {
                    $('#searchKeywordPrint', sel.iframe.contentWindow.document).html($(sel.akcLayerContent).html());
                });
        },

        hideIframe: function () {
            $(this.sel.iframe).hide();
        },

        // �먮룞�꾩꽦 �ㅼ썙�� 由ъ뒪�� 留ㅼ묶.
        // @param keywordList �먮룞�꾩꽦 �ㅼ썙�� 由ъ뒪��.
        // @return returnKeyword string 留ㅼ묶�� �ㅼ썙��.
        getAKCKeywordMatch: function (akcKeyword) {
            var akcTargetKeyword = akcKeyword.replace(/\s+/g, ''); // akc �ㅼ썙�� 怨듬갚 �쒓굅
            var targetAkcSourceKeyword = this.opt.akcSourceKeyword; // �낅젰 �ㅼ썙�� 怨듬갚 �쒓굅
            var targetAkcSourceTrimmedKeyword = targetAkcSourceKeyword.replace(/\s+/g, ''); // �낅젰 �ㅼ썙�� 怨듬갚 �쒓굅
            var returnAKCKeyword = ''; // 留ㅼ묶 寃곌낵 �ㅼ썙��

            if (akcTargetKeyword === targetAkcSourceTrimmedKeyword) {
                returnAKCKeyword += '<strong>' + akcKeyword + '</strong>';
            } else {
                // �ㅼ썙�� 泥ル�遺� 留ㅼ묶留� �섏꽌 湲곗〈 留ㅼ묶諛⑸쾿 �쒓굅�섍퀬 �뺢퇋�앹쑝濡� 蹂쇰뱶泥섎━�섍쾶�� 蹂�寃�
                var escapeTargetSourceKeyword = targetAkcSourceKeyword.replace(/[\\"'.]/g, '\\$&');

                returnAKCKeyword += akcKeyword.replace(
                    new RegExp(escapeTargetSourceKeyword, ''), //泥ル쾲吏몃줈 留ㅼ묶�섎뒗 �ㅼ썙�쒕쭔 �섏씠�쇱씠�� 泥섎━
                    `<strong>${targetAkcSourceKeyword}</strong>`
                );
            }

            if (returnAKCKeyword === '') {
                returnAKCKeyword = akcKeyword;
            }

            return returnAKCKeyword;
        },

        // �먮룞�꾩꽦 由ъ뒪�� �쇱씤 �섏씠�쇱씠��
        akcHighlight: function (target, flag) {
            $(this.sel.akcKeywordLayer).find('li').removeClass('hover');

            if (flag) {
                $(target).addClass('hover');
            } else {
                $(target).removeClass('hover');
            }
        },

        // �먮룞�꾩꽦 �덈궡 臾멸뎄
        getAKCInfo: function (flag) {
            var infoMessageHtml = '<div class="no_result"><p class="auto_word_information">';
            if (flag) {
                infoMessageHtml +=
                    '寃��됱뼱 �먮룞�꾩꽦 湲곕뒫�� �ъ슜�섍퀬 �덉뒿�덈떎.<br />' +
                    '�ъ슜�� �먰븯�쒖� �딅뒗�ㅻ㈃ <strong>�먮룞�꾩꽦 �꾧린</strong>瑜� �대┃�� 二쇱꽭��.';
            } else {
                infoMessageHtml +=
                    '寃��됱뼱 �먮룞�꾩꽦 湲곕뒫�� 以묒��섏뿀�듬땲��.<br />' +
                    '�ъ슜�� �먰븯�쒕㈃ <strong>湲곕뒫耳쒓린</strong>瑜� �대┃�� 二쇱꽭��.';
            }
            infoMessageHtml += '</p></div>';

            return infoMessageHtml;
        },

        AKCFocusOut: function () {
            if (!this.opt.isAKCArea) {
                this.akcDisplayControl(0);
            }
        },

        AKCOpenClose: function () {
            if (this.opt.isDisplayAKCService) {
                this.akcDisplayControl(0);
            } else {
                this.akcDisplayControl(1);
            }
        },

        // �먮룞�꾩꽦 �쒕퉬�� 而⑦듃濡ㅻ윭. �먮룞�꾩꽦 湲곕뒫 �ъ슜/誘몄궗�⑹뿉 ���� 湲곕뒫留� �섑뻾.
        // isUsingAKCService媛� true�대㈃ 湲곕뒫 誘몄긽�⑹쑝濡� �꾪솚, false�대㈃ �ъ슜�쇰줈 �꾪솚.
        akcServiceControl: function () {
            var opt = this.opt;
            var sel = this.sel;
            var $$ = this;

            if (opt.isUsingAKCService) {
                opt.isUsingAKCService = false;

                this.akcDisplayControl(0);
                this.akcServiceCtrlLayer();
                this.akcServiceCtrlLayer_new();
                this.changeSearchedKeywordView(false);

                $('#auto_goods_list', sel.akcGoodsLayer).hide();
                $('#auto_banner_layer', sel.akcGoodsLayer).show();

                $.cookie('isUsingAKCService', 'N', { expires: 365, path: '/', domain: 'danawa.com' });

                $$.trkEventLog(isMain ? '21�듯빀寃���_�먮룞�꾩꽦_湲곕뒫�꾧린' : '�듯빀寃���_global_�먮룞�꾩꽦_湲곕뒫�꾧린');
            } else {
                opt.isUsingAKCService = true;

                this.akcServiceCtrlLayer();
                this.akcServiceCtrlLayer_new();
                this.changeSearchedKeywordView(opt.akcSourceKeyword === '');
                this.akcDisplayControl(1);

                $.cookie('isUsingAKCService', 'Y', { expires: 365, path: '/', domain: 'danawa.com' });
            }
        },

        // �먮룞�꾩꽦 湲곕뒫 踰꾪듉 �덉씠�� �숈옉.
        akcServiceCtrlLayer: function () {
            if (this.opt.isUsingAKCService) {
                $(this.sel.serviceCtrlLayer).html('<a href="#" class="com_gnb auto_function_switch">�먮룞�꾩꽦 �꾧린</a>');
            } else {
                $(this.sel.serviceCtrlLayer).html('<a href="#" class="com_gnb auto_function_switch">湲곕뒫耳쒓린</a>');
            }
        },

        // �먮룞�꾩꽦 湲곕뒫 踰꾪듉 �덉씠�� �숈옉. (理쒓렐 寃��됱뼱)
        akcServiceCtrlLayer_new: function () {
            if (this.opt.isUsingAKCService) {
                $(this.sel.serviceCtrlLayer).html(
                    '<a href="#" class="com_gnb keyword_all_delete">�꾩껜 ��젣</a><a href="#" class="com_gnb auto_function_switch">�먮룞�꾩꽦 �꾧린</a>'
                );
            } else {
                $(this.sel.serviceCtrlLayer).html('<a href="#" class="com_gnb auto_function_switch">湲곕뒫耳쒓린</a>');
            }
        },

        // 寃��됰컯�� 諛뽰뿉�� keydown �대깽�� 諛쒖깮�� 寃��됰컯�ㅻ줈 �ъ빱��
        searchEventkeyHandler: function (event) {
            var sel = this.sel;

            var nodeName = event.target.nodeName;
            var keyCode = event.keyCode;

            if (
                !(
                    nodeName === 'INPUT' ||
                    nodeName === 'SELECT' ||
                    nodeName === 'TEXTAREA' ||
                    nodeName === 'OBJECT' ||
                    (event.ctrlKey && keyCode !== 86)
                )
            ) {
                //F5(116) �꾨��� �먮룞�꾩꽦 �⑥��딅룄濡� �덉쇅泥섎━ 15.06.24
                if (
                    keyCode === 8 ||
                    (keyCode > 32 && keyCode < 41) ||
                    (keyCode !== 21 && keyCode < 32) ||
                    (keyCode > 90 && keyCode < 94) ||
                    event.altKey ||
                    keyCode === 116 ||
                    event.metaKey
                ) {
                    //
                } else if (keyCode === 32) {
                    if (event.shiftKey) {
                        sel.akcKeywordInput.val('').focus();
                        event.returnValue = false;
                    }
                } else if (keyCode === 21) {
                    sel.akcKeywordInput.val('').focus();
                    event.returnValue = false;
                } else if (nodeName != sel.akcKeywordInput) {
                    sel.akcKeywordInput.val('').focus();
                }
            }
        },

        // �먮룞�꾩꽦 �곹뭹 媛��몄삤湲�
        makeGoodsListData: function () {
            var rankValue = parseInt($(`#akcSearchResult_${this.opt.akcListCurrentLine}`).attr('value'));

            if (rankValue < 1) {
                return;
            }

            $('#auto_banner_layer', this.sel.akcGoodsLayer).show();
        },

        // �ㅼ썙�쒖뿉 留욌뒗 異붿쿇�곹뭹�� �놁쓣 �� 諛곕꼫 異쒕젰
        printBanner: function () {
            $('#auto_banner_layer', this.sel.akcGoodsLayer).show();
            $('#auto_goods_list', this.sel.akcGoodsLayer).hide();
        },

        // 理쒓렐 寃��됱뼱 媛��몄삤湲�
        makeSearchedKeywordList: function () {
            var opt = this.opt;
            var sel = this.sel;
            var $$ = this;

            var searchKeywordCookieList = $$.getCookieMySearchKeyword();

            if (searchKeywordCookieList.length > 0) {
                var searchKeywordHtml = `
                    <dl class="searched_keyword">
                        <dt>理쒓렐 寃��됱뼱</dt>
                        <dd>
                            <ul id="mySearchKeywordListArea" class="searched_keyword_info">`;

                searchKeywordCookieList.forEach(function (value, index) {
                    var searchKeyword = '';
                    var searchDate = '';
                    if (typeof value === 'string') {
                        searchKeyword = value.split('>')[0] || '';
                        searchDate = value.split('>')[1] || '';
                    }
                    var searchKeywordId = `mySearchKeyword_${index + 1}`;
                    var deleteKeywordId = `deleteSearchKeyword_${index + 1}`;

                    if (searchKeyword !== '') {
                        searchKeywordHtml += `
                            <li id="${searchKeywordId}" text="${searchKeyword}">
                                <a href="${opt.akcLinkUrl + encodeURIComponent(searchKeyword)}">${searchKeyword}</a>
                                <span class="etc">
                                    <span class="date">${searchDate ? searchDate + '.' : ''}</span>
                                    <input type="button" id="${deleteKeywordId}" class="btn btn_delete" title="寃��됲븳 �ㅼ썙�� ��젣" />
                                </span>
                            </li>`;
                    }
                });

                searchKeywordHtml += '</ul></dd></dl>';

                $(sel.searchKeywordLayer)
                    .html(searchKeywordHtml)
                    .find('[id^="mySearchKeyword_"]')
                    .off('mouseenter mouseleave')
                    .on('mouseenter mouseleave', function (event) {
                        if (event.type === 'mouseenter') {
                            opt.myKeywordCurrentLine = $(event.currentTarget).attr('id')
                                ? parseInt($(event.currentTarget).attr('id').replace('mySearchKeyword_', '')) || 0
                                : 0;
                            $$.akcHighlight(event.currentTarget, true);
                        } else if (event.type === 'mouseleave') {
                            opt.myKeywordCurrentLine = 1;
                            $$.akcHighlight(event.currentTarget, false);
                        }
                    });

                if (opt.myKeywordTotalLine > 0) {
                    opt.myKeywordCurrentLine = 1;
                    $$.akcHighlight($('#mySearchKeyword_1'), false);
                }

                // 理쒓렐 寃��됱뼱 媛쒕퀎 �대┃
                $(sel.searchKeywordLayer)
                    .find('li[id^=mySearchKeyword_] a')
                    .off('click')
                    .on('click', function (event) {
                        var searchKeyword = $(event.currentTarget).parent('li').attr('text') || '';
                        if (searchKeyword) {
                            sel.akcKeywordInput.val(searchKeyword);
                        }

                        $$.trkEventLog(
                            isMain ? '21�듯빀寃���_�닿�寃��됲븳�ㅼ썙��_�ㅼ썙��' : '�듯빀寃���_global_�닿�寃��됲븳�ㅼ썙��_�ㅼ썙��'
                        );
                    });

                // 理쒓렐 寃��됱뼱 媛쒕퀎 ��젣
                $(sel.searchKeywordLayer)
                    .find('input[id^="deleteSearchKeyword_"]')
                    .off('click')
                    .on('click', function (event) {
                        var searchKeyword = $(event.currentTarget).parents('li').attr('text') || '';
                        var searchKeywordCookieList = $$.getCookieMySearchKeyword();

                        if (searchKeywordCookieList.length > 0) {
                            var hasRemoveItem = false;
                            var removeItemIndex = 0;

                            searchKeywordCookieList.forEach(function (value, index) {
                                if ($$.decodeHtmlEntities(value.split('>')[0]) === searchKeyword) {
                                    removeItemIndex = index;
                                    hasRemoveItem = true;
                                }
                            });

                            if (hasRemoveItem) {
                                searchKeywordCookieList.splice(removeItemIndex, 1);
                            }

                            if (searchKeywordCookieList.length > 0) {
                                searchKeywordCookieList = searchKeywordCookieList.join('|');
                            } else {
                                searchKeywordCookieList = null;
                            }

                            $$.setCookieMySearchKeyword(searchKeywordCookieList);

                            $('[id^="mySearchKeyword_"], [id^="myFixedSearchKeyword_"]').each(function () {
                                if ($(this).attr('text') === searchKeyword) {
                                    $(this).remove();
                                }
                            });
                        }
                    });
            } else {
                $$.setCookieMySearchKeyword(null);
            }

            $(sel.searchKeywordLayer).show();
        },

        //理쒓렐 寃��됱뼱 荑좏궎 ����
        setCookieMySearchKeyword: function (searchKeywordCookieValue) {
            var opt = this.opt;
            var sel = this.sel;

            if (searchKeywordCookieValue === null) {
                opt.myKeywordCurrentLine = 0;
                opt.myKeywordTotalLine = 0;

                $(sel.searchKeywordLayer).html(`
                    <div class="no_result">
                        <p class="auto_word_information">理쒓렐 寃��됲븳 �ㅼ썙�쒓� �놁뒿�덈떎.</p>
                    </div>
                `);
            } else {
                searchKeywordCookieValue =
                    typeof searchKeywordCookieValue === 'string' ? searchKeywordCookieValue.trim() : '';

                var searchKeywordCookieList = searchKeywordCookieValue.split('|').filter(function (value) {
                    return value.trim() !== '';
                });

                searchKeywordCookieValue = searchKeywordCookieList.join('|');

                opt.myKeywordTotalLine = searchKeywordCookieList.length;
                opt.myKeywordCurrentLine = 1;
            }

            $.cookie('cookNewSearchKeyword', searchKeywordCookieValue, {
                expires: 730,
                path: '/',
                domain: 'danawa.com'
            });
        },

        // 理쒓렐 寃��됱뼱 荑좏궎 議고쉶
        getCookieMySearchKeyword: function () {
            var opt = this.opt;

            var searchKeywordCookieList = [];
            var searchKeywordCookieValue = $.cookie('cookNewSearchKeyword') || '';

            if (searchKeywordCookieValue) {
                searchKeywordCookieList = searchKeywordCookieValue
                    .trim()
                    .split('|')
                    .filter(function (value) {
                        return value.trim() !== '';
                    });

                opt.myKeywordTotalLine = searchKeywordCookieList.length;
                opt.myKeywordCurrentLine = 1;
            }

            return searchKeywordCookieList;
        },

        // 理쒓렐 寃��됱뼱 �쒖뼱
        changeSearchedKeywordView: function (flag) {
            var $$ = this;
            var opt = this.opt;
            var sel = this.sel;

            if (flag) {
                $(sel.akcLayerContent).empty().hide();
                $$.makeSearchedKeywordList();
                this.akcServiceCtrlLayer_new();
            } else {
                $(sel.searchKeywordLayer).empty().hide();
                this.akcServiceCtrlLayer();
                $('li[id^="mySearchKeyword_"]').removeClass('hover');
                opt.myKeywordCurrentLine = 1;
            }

            opt.isMyKeywordService = flag;
        },

        //insight
        trkEventLog: function (message) {
            if (typeof _trk_clickTrace === 'function') {
                try {
                    _trk_clickTrace('EVT', message);
                } catch (error) {
                    console.error(error);
                }
            }
        },

        //�ъ슜�� �⑦꽩 遺꾩꽍 UXLOG
        doUxlogging: function (uxId, logData) {
            if (typeof DSAC === 'object' && DSAC !== null && uxId && logData) {
                DSAC.execute(
                    JSON.stringify({
                        uxid: uxId,
                        parameter: logData
                    })
                );
            }
        },

        removeStrongTag: function (str) {
            if (typeof str === 'string') {
                return str.replace(/<+(\/)?strong>/g, '').trim();
            } else {
                return '';
            }
        },

        decodeHtmlEntities: function (decodeString) {
            if (decodeString && typeof decodeString === 'string') {
                var element = document.createElement('div');
                decodeString = decodeString.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
                decodeString = decodeString.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
                element.innerHTML = decodeString;
                decodeString = element.textContent;
                element.textContent = '';
            } else {
                decodeString = '';
            }

            return decodeString;
        }
    };

    $.danawaSearchAutoComplete = function (selector, settings) {
        new autocomplete(selector, settings);
    };
    $.fn.danawaSearchAutoComplete = function (settings) {
        return this.each(function () {
            new $.danawaSearchAutoComplete(this, settings);
        });
    };

    /**
     * $.browser ��泥� �⑥닔
     */
    var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || 'Other';
            this.version = this.searchVersion(navigator.userAgent) || 'Unknown';
        },
        searchString: function (data) {
            var dataLength = data.length;

            for (var i = 0; i < dataLength; i++) {
                var dataString = data[i].string;
                this.versionSearchString = data[i].subString;

                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index === -1) {
                return;
            }

            var rv = dataString.indexOf('rv:');
            if (this.versionSearchString === 'Trident' && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3));
            } else {
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            }
        },

        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: 'Edge',
                identity: 'MS Edge'
            },
            {
                string: navigator.userAgent,
                subString: 'MSIE',
                identity: 'Explorer'
            },
            {
                string: navigator.userAgent,
                subString: 'Trident',
                identity: 'Explorer'
            },
            {
                string: navigator.userAgent,
                subString: 'Firefox',
                identity: 'Firefox'
            },
            {
                string: navigator.userAgent,
                subString: 'Opera',
                identity: 'Opera'
            },
            {
                string: navigator.userAgent,
                subString: 'OPR',
                identity: 'Opera'
            },
            {
                string: navigator.userAgent,
                subString: 'Chrome',
                identity: 'Chrome'
            },
            {
                string: navigator.userAgent,
                subString: 'Safari',
                identity: 'Safari'
            }
        ]
    };
})(jQuery);