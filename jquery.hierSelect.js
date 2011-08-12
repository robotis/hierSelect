//[[
/*
 * jQuery hierSelect Plugin
 * @requires jQuery v1.4 or later
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0
 * @author  <jtm@hi.is>
 */
//]]
(function($){
	$.fn.hierSelect = function(tree, options) 
	{
    options = $.extend({
        starter: 'Veldu...',
        select_class: 'hselect',
        leaf_class: 'final',
        node_class: 'more',
        empty_value: '',
        selected: []
    }, options || {});
    
    var getClean = function (name) 
    {
        return name.replace(/_*$/, '');
    };

    var removeNested = function (name) 
    {
        $("select[name^='"+ name + "']").remove();
    };

    var setValue = function(name, value) 
    {
        $("input[name='" + getClean(name) + "']").val(value).change();
    };
    
    var prune = function(index) 
    {
    	var o = new Array();
    	for(i=0;i<options.selected.length;i++) 
    	{
    		if(options.selected[i] != index) 
    			o[i] = options.selected[i];
    	}
    	options.selected = o;
    };
    
    return this.each(function() 
    	{
        var name = $(this).attr('name') + "_";
        
        removeNested(name);
        
        if (typeof tree == "object") 
        { 
            var $select = $("<select>").attr('name',name).change(function() 
            	{
            	var clean = getClean(name);
            	var set = options.empty_value;
            	setValue(name, set);
                if (this.options[this.selectedIndex].value != '') 
                {               	
                	var opt = (typeof tree[this.options[this.selectedIndex].value] == 'object')
                		? tree[this.options[this.selectedIndex].value]
                		: this.options[this.selectedIndex].value;               		               	 
                	 set = this.options[this.selectedIndex].value;
                	 setValue(name, set);
                	 $(this).hierSelect(opt, options);
                } 
                else 
                {
                	// Set selected from parent select
                    if(name != clean + '_') {
                    	var parent = name.substr(0, name.length-1);
                    	set = $("select[name="+parent+"] option:selected").val();
                    }
                    removeNested(name + '_');     
                    setValue(name, set);
                }
            });

            if ($(this).is('input'))
                $select.insertBefore(this);
            else
                $select.insertAfter(this);

            if (options.select_class)
                $select.addClass(options.select_class);

            if (options.starter)
            	$("<option>").html(options.starter).val('').appendTo($select);
            
            $.each(tree, function(k, v) 
            {
            	if(k == 'name') return;
                var o = null;
                if(typeof v != 'object') 
                {
                	o = $("<option>").html(v)
                    .attr('value', k);
                	if (options.leaf_class) 
                	{
                		 o.addClass(options.leaf_class);
                	}
                } 
                else 
                {
                	o = $("<option>").html(v['name'])
                    .attr('value', k);
                	if (options.node_class) 
                	{
               		 	o.addClass(options.node_class);
                	}
                }
                $select.append(o);
                if(jQuery.isArray(options.selected)) 
                {
		            if(jQuery.inArray(k, options.selected) > -1) 
		            {
		                o.get(0).selected = true;
		                prune(k);
		                $select.change();
		            }
                }
            });
        } 
    });
    // END
    return this;
};})(jQuery);