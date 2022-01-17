/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: https://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE

window.Sizzle = Sizzle;

})();
﻿/*  
	Animator.js 1.1.11
	
	This library is released under the BSD license:

	Copyright (c) 2006, Bernard Sumption. All rights reserved.
	
	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are met:
	
	Redistributions of source code must retain the above copyright notice, this
	list of conditions and the following disclaimer. Redistributions in binary
	form must reproduce the above copyright notice, this list of conditions and
	the following disclaimer in the documentation and/or other materials
	provided with the distribution. Neither the name BernieCode nor
	the names of its contributors may be used to endorse or promote products
	derived from this software without specific prior written permission. 
	
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
	ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
	DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
	SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
	CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
	LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
	OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
	DAMAGE.

*/


// Applies a sequence of numbers between 0 and 1 to a number of subjects
// construct - see setOptions for parameters
function Animator(options) {
	this.setOptions(options);
	var _this = this;
	this.timerDelegate = function(){_this.onTimerEvent()};
	this.subjects = [];
	this.target = 0;
	this.state = 0;
	this.lastTime = null;
};
Animator.prototype = {
	// apply defaults
	setOptions: function(options) {
		this.options = Animator.applyDefaults({
			interval: 20,  // time between animation frames
			duration: 400, // length of animation
			onComplete: function(){},
			onStep: function(){},
			transition: Animator.tx.easeInOut
		}, options);
	},
	// animate from the current state to provided value
	seekTo: function(to) {
		this.seekFromTo(this.state, to);
	},
	// animate from the current state to provided value
	seekFromTo: function(from, to) {
		this.target = Math.max(0, Math.min(1, to));
		this.state = Math.max(0, Math.min(1, from));
		this.lastTime = new Date().getTime();
		if (!this.intervalId) {
			this.intervalId = window.setInterval(this.timerDelegate, this.options.interval);
		}
	},
	// animate from the current state to provided value
	jumpTo: function(to) {
		this.target = this.state = Math.max(0, Math.min(1, to));
		this.propagate();
	},
	// seek to the opposite of the current target
	toggle: function() {
		this.seekTo(1 - this.target);
	},
	// add a function or an object with a method setState(state) that will be called with a number
	// between 0 and 1 on each frame of the animation
	addSubject: function(subject) {
		this.subjects[this.subjects.length] = subject;
		return this;
	},
	// remove all subjects
	clearSubjects: function() {
		this.subjects = [];
	},
	// forward the current state to the animation subjects
	propagate: function() {
		var value = this.options.transition(this.state);
		for (var i=0; i<this.subjects.length; i++) {
			if (this.subjects[i].setState) {
				this.subjects[i].setState(value);
			} else {
				this.subjects[i](value);
			}
		}
	},
	// called once per frame to update the current state
	onTimerEvent: function() {
		var now = new Date().getTime();
		var timePassed = now - this.lastTime;
		this.lastTime = now;
		var movement = (timePassed / this.options.duration) * (this.state < this.target ? 1 : -1);
		if (Math.abs(movement) >= Math.abs(this.state - this.target)) {
			this.state = this.target;
		} else {
			this.state += movement;
		}
		
		try {
			this.propagate();
		} finally {
			this.options.onStep.call(this);
			if (this.target == this.state) {
				this.stop();
			}
		}
	},
	stop: function() {
		if (this.intervalId) {
			window.clearInterval(this.intervalId);
			this.intervalId = null;
			this.options.onComplete.call(this);
		}
	},
	// shortcuts
	play: function() {this.seekFromTo(0, 1)},
	reverse: function() {this.seekFromTo(1, 0)},
	// return a string describing this Animator, for debugging
	inspect: function() {
		var str = "#<Animator:\n";
		for (var i=0; i<this.subjects.length; i++) {
			str += this.subjects[i].inspect();
		}
		str += ">";
		return str;
	}
}
// merge the properties of two objects
Animator.applyDefaults = function(defaults, prefs) {
	prefs = prefs || {};
	var prop, result = {};
	for (prop in defaults) result[prop] = prefs[prop] !== undefined ? prefs[prop] : defaults[prop];
	return result;
}
// make an array from any object
Animator.makeArrayOfElements = function(o) {
	if (o == null) return [];
	if ("string" == typeof o) {
		return [document.getElementById(o)];
	}
	if (!o.length) return [o];
	var result = [];
	for (var i=0; i<o.length; i++) {
		if ("string" == typeof o[i]) {
			result[i] = document.getElementById(o[i]);
		} else {
			result[i] = o[i];
		}
	}
	return result;
}
// convert a dash-delimited-property to a camelCaseProperty (c/o Prototype, thanks Sam!)
Animator.camelize = function(string) {
	var oStringList = string.split('-');
	if (oStringList.length == 1) return oStringList[0];
	
	var camelizedString = string.indexOf('-') == 0
		? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1)
		: oStringList[0];
	
	for (var i = 1, len = oStringList.length; i < len; i++) {
		var s = oStringList[i];
		camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
	}
	return camelizedString;
}
// syntactic sugar for creating CSSStyleSubjects
Animator.apply = function(el, style, options) {
	if (style instanceof Array) {
		return new Animator(options).addSubject(new CSSStyleSubject(el, style[0], style[1]));
	}
	return new Animator(options).addSubject(new CSSStyleSubject(el, style));
}
// make a transition function that gradually accelerates. pass a=1 for smooth
// gravitational acceleration, higher values for an exaggerated effect
Animator.makeEaseIn = function(a) {
	return function(state) {
		return Math.pow(state, a*2); 
	}
}
// as makeEaseIn but for deceleration
Animator.makeEaseOut = function(a) {
	return function(state) {
		return 1 - Math.pow(1 - state, a*2); 
	}
}
// make a transition function that, like an object with momentum being attracted to a point,
// goes past the target then returns
Animator.makeElastic = function(bounces) {
	return function(state) {
		state = Animator.tx.easeInOut(state);
		return ((1-Math.cos(state * Math.PI * bounces)) * (1 - state)) + state; 
	}
}
// make an Attack Decay Sustain Release envelope that starts and finishes on the same level
// 
Animator.makeADSR = function(attackEnd, decayEnd, sustainEnd, sustainLevel) {
	if (sustainLevel == null) sustainLevel = 0.5;
	return function(state) {
		if (state < attackEnd) {
			return state / attackEnd;
		}
		if (state < decayEnd) {
			return 1 - ((state - attackEnd) / (decayEnd - attackEnd) * (1 - sustainLevel));
		}
		if (state < sustainEnd) {
			return sustainLevel;
		}
		return sustainLevel * (1 - ((state - sustainEnd) / (1 - sustainEnd)));
	}
}
// make a transition function that, like a ball falling to floor, reaches the target and/
// bounces back again
Animator.makeBounce = function(bounces) {
	var fn = Animator.makeElastic(bounces);
	return function(state) {
		state = fn(state); 
		return state <= 1 ? state : 2-state;
	}
}
 
// pre-made transition functions to use with the 'transition' option
Animator.tx = {
	easeInOut: function(pos){
		return ((-Math.cos(pos*Math.PI)/2) + 0.5);
	},
	linear: function(x) {
		return x;
	},
	easeIn: Animator.makeEaseIn(1.5),
	easeOut: Animator.makeEaseOut(1.5),
	strongEaseIn: Animator.makeEaseIn(2.5),
	strongEaseOut: Animator.makeEaseOut(2.5),
	elastic: Animator.makeElastic(1),
	veryElastic: Animator.makeElastic(3),
	bouncy: Animator.makeBounce(1),
	veryBouncy: Animator.makeBounce(3)
}

// animates a pixel-based style property between two integer values
function NumericalStyleSubject(els, property, from, to, units) {
	this.els = Animator.makeArrayOfElements(els);
	this.property = Animator.camelize(property);
	this.from = parseFloat(from);
	this.to = parseFloat(to);
	this.units = units != null ? units : 'px';
}
NumericalStyleSubject.prototype = {
	setState: function(state) {
		var style = this.getStyle(state);
		var visibility = (this.property == 'opacity' && state == 0) ? 'hidden' : '';
		var j=0;
		for (var i=0; i<this.els.length; i++) {
			try {
				this.els[i].style[this.property] = style;
			} catch (e) {
				// ignore fontWeight - intermediate numerical values cause exeptions in firefox
				if (this.property != 'fontWeight') throw e;
			}
			if (j++ > 20) return;
		}
	},
	getStyle: function(state) {
		state = this.from + ((this.to - this.from) * state);
		if (this.property == 'opacity') return state;
		return Math.round(state) + this.units;
	},
	inspect: function() {
		return "\t" + this.property + "(" + this.from + this.units + " to " + this.to + this.units + ")\n";
	}
}

// animates a colour based style property between two hex values
function ColorStyleSubject(els, property, from, to) {
	this.els = Animator.makeArrayOfElements(els);
	this.property = Animator.camelize(property);
	this.to = this.expandColor(to);
	this.from = this.expandColor(from);
	this.origFrom = from;
	this.origTo = to;
}

ColorStyleSubject.prototype = {
	// parse "#FFFF00" to [256, 256, 0]
	expandColor: function(color) {
		var hexColor, red, green, blue;
		hexColor = ColorStyleSubject.parseColor(color);
		if (hexColor) {
			red = parseInt(hexColor.slice(1, 3), 16);
			green = parseInt(hexColor.slice(3, 5), 16);
			blue = parseInt(hexColor.slice(5, 7), 16);
			return [red,green,blue]
		}
		if (window.ANIMATOR_DEBUG) {
			alert("Invalid colour: '" + color + "'");
		}
	},
	getValueForState: function(color, state) {
		return Math.round(this.from[color] + ((this.to[color] - this.from[color]) * state));
	},
	setState: function(state) {
		var color = '#'
				+ ColorStyleSubject.toColorPart(this.getValueForState(0, state))
				+ ColorStyleSubject.toColorPart(this.getValueForState(1, state))
				+ ColorStyleSubject.toColorPart(this.getValueForState(2, state));
		for (var i=0; i<this.els.length; i++) {
			this.els[i].style[this.property] = color;
		}
	},
	inspect: function() {
		return "\t" + this.property + "(" + this.origFrom + " to " + this.origTo + ")\n";
	}
}

// return a properly formatted 6-digit hex colour spec, or false
ColorStyleSubject.parseColor = function(string) {
	var color = '#', match;
	if(match = ColorStyleSubject.parseColor.rgbRe.exec(string)) {
		var part;
		for (var i=1; i<=3; i++) {
			part = Math.max(0, Math.min(255, parseInt(match[i])));
			color += ColorStyleSubject.toColorPart(part);
		}
		return color;
	}
	if (match = ColorStyleSubject.parseColor.hexRe.exec(string)) {
		if(match[1].length == 3) {
			for (var i=0; i<3; i++) {
				color += match[1].charAt(i) + match[1].charAt(i);
			}
			return color;
		}
		return '#' + match[1];
	}
	return false;
}
// convert a number to a 2 digit hex string
ColorStyleSubject.toColorPart = function(number) {
	if (number > 255) number = 255;
	var digits = number.toString(16);
	if (number < 16) return '0' + digits;
	return digits;
}
ColorStyleSubject.parseColor.rgbRe = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
ColorStyleSubject.parseColor.hexRe = /^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// Animates discrete styles, i.e. ones that do not scale but have discrete values
// that can't be interpolated
function DiscreteStyleSubject(els, property, from, to, threshold) {
	this.els = Animator.makeArrayOfElements(els);
	this.property = Animator.camelize(property);
	this.from = from;
	this.to = to;
	this.threshold = threshold || 0.5;
}

DiscreteStyleSubject.prototype = {
	setState: function(state) {
		var j=0;
		for (var i=0; i<this.els.length; i++) {
			this.els[i].style[this.property] = state <= this.threshold ? this.from : this.to; 
		}
	},
	inspect: function() {
		return "\t" + this.property + "(" + this.from + " to " + this.to + " @ " + this.threshold + ")\n";
	}
}

// animates between two styles defined using CSS.
// if style1 and style2 are present, animate between them, if only style1
// is present, animate between the element's current style and style1
function CSSStyleSubject(els, style1, style2) {
	els = Animator.makeArrayOfElements(els);
	this.subjects = [];
	if (els.length == 0) return;
	var prop, toStyle, fromStyle;
	if (style2) {
		fromStyle = this.parseStyle(style1, els[0]);
		toStyle = this.parseStyle(style2, els[0]);
	} else {
		toStyle = this.parseStyle(style1, els[0]);
		fromStyle = {};
		for (prop in toStyle) {
			fromStyle[prop] = CSSStyleSubject.getStyle(els[0], prop);
		}
	}
	// remove unchanging properties
	var prop;
	for (prop in fromStyle) {
		if (fromStyle[prop] == toStyle[prop]) {
			delete fromStyle[prop];
			delete toStyle[prop];
		}
	}
	// discover the type (numerical or colour) of each style
	var prop, units, match, type, from, to;
	for (prop in fromStyle) {
		var fromProp = String(fromStyle[prop]);
		var toProp = String(toStyle[prop]);
		if (toStyle[prop] == null) {
			if (window.ANIMATOR_DEBUG) alert("No to style provided for '" + prop + '"');
			continue;
		}
		
		if (from = ColorStyleSubject.parseColor(fromProp)) {
			to = ColorStyleSubject.parseColor(toProp);
			type = ColorStyleSubject;
		} else if (fromProp.match(CSSStyleSubject.numericalRe)
				&& toProp.match(CSSStyleSubject.numericalRe)) {
			from = parseFloat(fromProp);
			to = parseFloat(toProp);
			type = NumericalStyleSubject;
			match = CSSStyleSubject.numericalRe.exec(fromProp);
			var reResult = CSSStyleSubject.numericalRe.exec(toProp);
			if (match[1] != null) {
				units = match[1];
			} else if (reResult[1] != null) {
				units = reResult[1];
			} else {
				units = reResult;
			}
		} else if (fromProp.match(CSSStyleSubject.discreteRe)
				&& toProp.match(CSSStyleSubject.discreteRe)) {
			from = fromProp;
			to = toProp;
			type = DiscreteStyleSubject;
			units = 0;   // hack - how to get an animator option down to here
		} else {
			if (window.ANIMATOR_DEBUG) {
				alert("Unrecognised format for value of "
					+ prop + ": '" + fromStyle[prop] + "'");
			}
			continue;
		}
		this.subjects[this.subjects.length] = new type(els, prop, from, to, units);
	}
}

CSSStyleSubject.prototype = {
	// parses "width: 400px; color: #FFBB2E" to {width: "400px", color: "#FFBB2E"}
	parseStyle: function(style, el) {
		var rtn = {};
		// if style is a rule set
		if (style.indexOf(":") != -1) {
			var styles = style.split(";");
			for (var i=0; i<styles.length; i++) {
				var parts = CSSStyleSubject.ruleRe.exec(styles[i]);
				if (parts) {
					rtn[parts[1]] = parts[2];
				}
			}
		}
		// else assume style is a class name
		else {
			var prop, value, oldClass;
			oldClass = el.className;
			el.className = style;
			for (var i=0; i<CSSStyleSubject.cssProperties.length; i++) {
				prop = CSSStyleSubject.cssProperties[i];
				value = CSSStyleSubject.getStyle(el, prop);
				if (value != null) {
					rtn[prop] = value;
				}
			}
			el.className = oldClass;
		}
		return rtn;
		
	},
	setState: function(state) {
		for (var i=0; i<this.subjects.length; i++) {
			this.subjects[i].setState(state);
		}
	},
	inspect: function() {
		var str = "";
		for (var i=0; i<this.subjects.length; i++) {
			str += this.subjects[i].inspect();
		}
		return str;
	}
}
// get the current value of a css property, 
CSSStyleSubject.getStyle = function(el, property){
	var style;
	if(document.defaultView && document.defaultView.getComputedStyle){
		style = document.defaultView.getComputedStyle(el, "").getPropertyValue(property);
		if (style) {
			return style;
		}
	}
	property = Animator.camelize(property);
	if(el.currentStyle){
		style = el.currentStyle[property];
	}
	return style || el.style[property]
}


CSSStyleSubject.ruleRe = /^\s*([a-zA-Z\-]+)\s*:\s*(\S(.+\S)?)\s*$/;
CSSStyleSubject.numericalRe = /^-?\d+(?:\.\d+)?(%|[a-zA-Z]{2})?$/;
CSSStyleSubject.discreteRe = /^\w+$/;

// required because the style object of elements isn't enumerable in Safari
/*
CSSStyleSubject.cssProperties = ['background-color','border','border-color','border-spacing',
'border-style','border-top','border-right','border-bottom','border-left','border-top-color',
'border-right-color','border-bottom-color','border-left-color','border-top-width','border-right-width',
'border-bottom-width','border-left-width','border-width','bottom','color','font-size','font-size-adjust',
'font-stretch','font-style','height','left','letter-spacing','line-height','margin','margin-top',
'margin-right','margin-bottom','margin-left','marker-offset','max-height','max-width','min-height',
'min-width','orphans','outline','outline-color','outline-style','outline-width','overflow','padding',
'padding-top','padding-right','padding-bottom','padding-left','quotes','right','size','text-indent',
'top','width','word-spacing','z-index','opacity','outline-offset'];*/


CSSStyleSubject.cssProperties = ['azimuth','background','background-attachment','background-color','background-image','background-position','background-repeat','border-collapse','border-color','border-spacing','border-style','border-top','border-top-color','border-right-color','border-bottom-color','border-left-color','border-top-style','border-right-style','border-bottom-style','border-left-style','border-top-width','border-right-width','border-bottom-width','border-left-width','border-width','bottom','clear','clip','color','content','cursor','direction','display','elevation','empty-cells','css-float','font','font-family','font-size','font-size-adjust','font-stretch','font-style','font-variant','font-weight','height','left','letter-spacing','line-height','list-style','list-style-image','list-style-position','list-style-type','margin','margin-top','margin-right','margin-bottom','margin-left','max-height','max-width','min-height','min-width','orphans','outline','outline-color','outline-style','outline-width','overflow','padding','padding-top','padding-right','padding-bottom','padding-left','pause','position','right','size','table-layout','text-align','text-decoration','text-indent','text-shadow','text-transform','top','vertical-align','visibility','white-space','width','word-spacing','z-index','opacity','outline-offset','overflow-x','overflow-y'];


// chains several Animator objects together
function AnimatorChain(animators, options) {
	this.animators = animators;
	this.setOptions(options);
	for (var i=0; i<this.animators.length; i++) {
		this.listenTo(this.animators[i]);
	}
	this.forwards = false;
	this.current = 0;
}

AnimatorChain.prototype = {
	// apply defaults
	setOptions: function(options) {
		this.options = Animator.applyDefaults({
			// by default, each call to AnimatorChain.play() calls jumpTo(0) of each animator
			// before playing, which can cause flickering if you have multiple animators all
			// targeting the same element. Set this to false to avoid this.
			resetOnPlay: true
		}, options);
	},
	// play each animator in turn
	play: function() {
		this.forwards = true;
		this.current = -1;
		if (this.options.resetOnPlay) {
			for (var i=0; i<this.animators.length; i++) {
				this.animators[i].jumpTo(0);
			}
		}
		this.advance();
	},
	// play all animators backwards
	reverse: function() {
		this.forwards = false;
		this.current = this.animators.length;
		if (this.options.resetOnPlay) {
			for (var i=0; i<this.animators.length; i++) {
				this.animators[i].jumpTo(1);
			}
		}
		this.advance();
	},
	// if we have just play()'d, then call reverse(), and vice versa
	toggle: function() {
		if (this.forwards) {
			this.seekTo(0);
		} else {
			this.seekTo(1);
		}
	},
	// internal: install an event listener on an animator's onComplete option
	// to trigger the next animator
	listenTo: function(animator) {
		var oldOnComplete = animator.options.onComplete;
		var _this = this;
		animator.options.onComplete = function() {
			if (oldOnComplete) oldOnComplete.call(animator);
			_this.advance();
		}
	},
	// play the next animator
	advance: function() {
		if (this.forwards) {
			if (this.animators[this.current + 1] == null) return;
			this.current++;
			this.animators[this.current].play();
		} else {
			if (this.animators[this.current - 1] == null) return;
			this.current--;
			this.animators[this.current].reverse();
		}
	},
	// this function is provided for drop-in compatibility with Animator objects,
	// but only accepts 0 and 1 as target values
	seekTo: function(target) {
		if (target <= 0) {
			this.forwards = false;
			this.animators[this.current].seekTo(0);
		} else {
			this.forwards = true;
			this.animators[this.current].seekTo(1);
		}
	}
};


AudioFX = function() {

  //---------------------------------------------------------------------------

  var hasAudio = false, audio = document.createElement('audio'), audioSupported = function(type) { var s = audio.canPlayType(type); return (s === 'probably') || (s === 'maybe'); };
  if (audio && audio.canPlayType) {
    hasAudio = {
      ogg: audioSupported('audio/ogg; codecs="vorbis"'),
      mp3: audioSupported('audio/mpeg;'),
      wav: audioSupported('audio/wav; codecs="1"'),
      loop: (typeof audio.loop === 'boolean') // some browsers (FF) dont support loop yet
    }
  }

  var isplaying = function(audio) { return !audio.paused && !audio.ended; }

  //---------------------------------------------------------------------------

  var create = function(src, options, onload) {

    var audio = document.createElement('audio');

    if (onload) {
      var ready = function() {
        audio.removeEventListener('canplay', ready, false);
        onload();
      }
      audio.addEventListener('canplay', ready, false);
    }

    if (options.loop) { //&& !hasAudio.loop
   		audio.addEventListener('ended', function() { 
   			//audio.stop(); 
   			audio.currentTime = 2.7; 
   			audio.play(); 
   		}, false); 	
    }


    audio.volume = options.volume || 0.8;
    //audio.loop   = options.loop;
    audio.src    = src;

    return audio;
  }

  //---------------------------------------------------------------------------

  var wrapper = function(src, options, onload) {

    var pool = [];
    if (hasAudio) {
      for(var n = 0 ; n < (options.pool || 1) ; n++)
        pool.push(create(src, options, n == 0 ? onload : null));
    }
    else {
      onload();
    }

    var find = function() {
      var n, audio;
      for(n = 0 ; n < pool.length ; n++) {
        audio = pool[n];
        if (audio.paused || audio.ended)
          return audio;
      }
    };

    return {

      audio: (pool.length == 1 ? pool[0] : pool),

      play: function() {
        var audio = find();
        if (audio) {
        	audio.play();
        }
          
      },

      stop: function() {
        var n, audio;
        for(n = 0 ; n < pool.length ; n++) {
          audio = pool[n];
          if (isplaying(audio)) {
            audio.pause();
            audio.currentTime = 2.7;
          }
        }
      },     
       
      time: function(t) {
        var n, audio;
        for(n = 0 ; n < pool.length ; n++) {
          audio = pool[n];
          if (isplaying(audio)) {
            audio.currentTime = t;
          }
        }
      }
    };

  };

  //---------------------------------------------------------------------------

  var factory = function(name, options, onload) {
    options = options || {};

    var src = name, formats = options.formats;
    if (formats) {
      for(var n = 0 ; n < formats.length ; n++) {
        if (hasAudio && hasAudio[formats[n]]) {
          src = src + '.' + formats[n];
          break;  
        }
      }
    }

    return wrapper(src, options, onload);
  };

  //---------------------------------------------------------------------------

  factory.enabled = hasAudio; // expose feature detection as AudioFX.enabled

  return factory; // caller should "var sound = AudioFX(name, options, onload)"

  //---------------------------------------------------------------------------

}();

StateMachine = {

  //---------------------------------------------------------------------------

  VERSION: "2.0.0",

  //---------------------------------------------------------------------------

  create: function(cfg, target) {

    var initial   = (typeof cfg.initial == 'string') ? { state: cfg.initial } : cfg.initial; // allow for a simple string, or an object with { state: 'foo', event: 'setup', defer: true|false }
    var fsm       = target || cfg.target  || {};
    var events    = cfg.events || [];
    var callbacks = cfg.callbacks || {};
    var map       = {};

    var add = function(e) {
      var from = (e.from instanceof Array) ? e.from : [e.from];
      map[e.name] = map[e.name] || {};
      for (var n = 0 ; n < from.length ; n++)
        map[e.name][from[n]] = e.to;
    };

    if (initial) {
      initial.event = initial.event || 'startup';
      add({ name: initial.event, from: 'none', to: initial.state });
    }

    for(var n = 0 ; n < events.length ; n++)
      add(events[n]);

    for(var name in map) {
      if (map.hasOwnProperty(name))
        fsm[name] = StateMachine.buildEvent(name, map[name]);
    }

    for(var name in callbacks) {
      if (callbacks.hasOwnProperty(name))
        fsm[name] = callbacks[name]
    }

    fsm.current = 'none';
    fsm.is      = function(state) { return this.current == state; };
    fsm.can     = function(event) { return !!map[event][this.current] && !this.transition; };
    fsm.cannot  = function(event) { return !this.can(event); };

    if (initial && !initial.defer)
      fsm[initial.event]();

    return fsm;

  },

  //===========================================================================

  beforeEvent: function(name, from, to, args) {
    var func = this['onbefore' + name];
    if (func)
      return func.apply(this, [name, from, to].concat(args));
  },

  afterEvent: function(name, from, to, args) {
    var func = this['onafter'  + name] || this['on' + name];
    if (func)
      return func.apply(this, [name, from, to].concat(args));
  },

  leaveState: function(name, from, to, args) {
    var func = this['onleave' + from];
    if (func)
      return func.apply(this, [name, from, to].concat(args));
  },

  enterState: function(name, from, to, args) {
    var func = this['onenter' + to] || this['on' + to];
    if (func)
      return func.apply(this, [name, from, to].concat(args));
  },

  changeState: function(name, from, to, args) {
    var func = this['onchangestate'];
    if (func)
      return func.apply(this, [name, from, to].concat(args));
  },

  buildEvent: function(name, map) {
    return function() {

      if (this.transition)
        throw "event " + name + " innapropriate because previous transition did not complete"

      if (this.cannot(name))
        throw "event " + name + " innapropriate in current state " + this.current;

      var from  = this.current;
      var to    = map[from];
      var args  = Array.prototype.slice.call(arguments); // turn arguments into pure array

      if (this.current != to) {

        if (false === StateMachine.beforeEvent.call(this, name, from, to, args))
          return;

        var self = this;
        this.transition = function() { // prepare transition method for use either lower down, or by caller if they want an async transition (indicated by a false return value from leaveState)
          self.transition = null; // this method should only ever be called once
          self.current = to;
          StateMachine.enterState.call( self, name, from, to, args);
          StateMachine.changeState.call(self, name, from, to, args);
          StateMachine.afterEvent.call( self, name, from, to, args);
        };

        if (false !== StateMachine.leaveState.call(this, name, from, to, args)) {
          if (this.transition) // in case user manually called it but forgot to return false
            this.transition();
        }
      }

    };
  }

  //===========================================================================

};

//=============================================================================
// feature detection
//=============================================================================
userAgent = function() {

  var ua  = navigator.userAgent.toLowerCase(); // should avoid user agent sniffing... but sometimes you just gotta do what you gotta do
  var key =        ((ua.indexOf("opera")   > -1) ? "opera"   : null);
      key = key || ((ua.indexOf("firefox") > -1) ? "firefox" : null);
      key = key || ((ua.indexOf("chrome")  > -1) ? "chrome"  : null);
      key = key || ((ua.indexOf("safari")  > -1) ? "safari"  : null);
      key = key || ((ua.indexOf("msie")    > -1) ? "ie"      : null);

  try {
    var re      = (key == "ie") ? "msie (\\d)" : key + "\\/(\\d\\.\\d)"
    var matches = ua.match(new RegExp(re, "i"));
    var version = matches ? parseFloat(matches[1]) : null;
  } catch (e) {}

  return {
    full:      ua,
    name:      key + (version ? " " + version.toString() : ""),
    version:   version,
    isFirefox: (key == "firefox"),
    isChrome:  (key == "chrome"),
    isSafari:  (key == "safari"),
    isOpera:   (key == "opera"),
    isIE:      (key == "ie"),
    hasAudio:  AudioFX && AudioFX.enabled,
    hasCanvas: (document.createElement('canvas').getContext),
    hasTouch:  ('ontouchstart' in window)
  }
}();

//=============================================================================
// type detection
//=============================================================================

is = {
  string:         function(obj) { return (typeof obj === 'string');                 },
  number:         function(obj) { return (typeof obj === 'number');                 },
  bool:           function(obj) { return (typeof obj === 'boolean');                },
  array:          function(obj) { return (obj instanceof Array);                    },
  undefined:      function(obj) { return (typeof obj === 'undefined');              },
  'null':         function(obj) { return (obj === null);                            },
  notNull:        function(obj) { return (obj !== null);                            },
  invalid:        function(obj) { return ( is['null'](obj) ||  is.undefined(obj));  },
  valid:          function(obj) { return (!is['null'](obj) && !is.undefined(obj));  },
  emptyString:    function(obj) { return (is.string(obj) && (obj.length == 0));     },
  nonEmptyString: function(obj) { return (is.string(obj) && (obj.length > 0));      },
  emptyArray:     function(obj) { return (is.array(obj) && (obj.length == 0));      },
  nonEmptyArray:  function(obj) { return (is.array(obj) && (obj.length > 0));       },
  document:       function(obj) { return (obj === document);                        }, 
  window:         function(obj) { return (obj === window);                          },
  element:        function(obj) { return (obj instanceof HTMLElement);              },
  event:          function(obj) { return (obj instanceof Event);                    },
  link:           function(obj) { return (is.element(obj) && (obj.tagName == 'A')); }
}

//=============================================================================
// type coersion
//=============================================================================

toBool   = function(obj, def) { if (is.valid(obj)) return ((obj == 1) || (obj == true) || (obj == "1") || (obj.toString().toLowerCase() == "true") || (obj.toString().toLowerCase() == 'yes')); else return (is.bool(def) ? def : false); };
toInt    = function(obj, def) { if (is.valid(obj)) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return (is.number(def) ? def : 0); };
toString = function(obj, def) { if (is.valid(obj)) return obj.toString(); return (is.string(def) ? def : ''); };
toFloat  = function(obj, def) { if (is.valid(obj)) { var x = parseFloat(obj); if (!isNaN(x)) return x; } return (is.number(def) ? def : 0.0); };
    
//=============================================================================
//
// Compatibility for older browsers (compatibility: https://kangax.github.com/es5-compat-table/)
//
//  Function.bind:        https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
//  Object.create:        https://javascript.crockford.com/prototypal.html
//  Object.extend:        (defacto standard like jquery $.extend or prototype's Object.extend)
//  Class.create:         create a simple javascript 'class' (a constructor function with a prototype and optional class methods)
//
//=============================================================================

if (!Function.prototype.bind) {
  Function.prototype.bind = function(obj) {
    var slice = [].slice,
        args  = slice.call(arguments, 1),
        self  = this,
        nop   = function () {},
        bound = function () {
          return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));   
        };
    nop.prototype   = self.prototype;
    bound.prototype = new nop();
    return bound;
  };
}

if (!Object.create) {
  Object.create = function(base) {
    function F() {};
    F.prototype = base;
    return new F();
  }
}

if (!Object.extend) {
  Object.extend = function(destination, source) {
    for (var property in source) {
      if (source.hasOwnProperty(property))
        destination[property] = source[property];
    }
    return destination;
  };
}

var Class = {
  create: function(prototype, extensions) {
    var ctor = function() { if (this.initialize) return this.initialize.apply(this, arguments); }
    ctor.prototype = prototype || {};      // instance methods
    Object.extend(ctor, extensions || {}); // class methods
    return ctor;
  }
}

if (!window.requestAnimationFrame) {// https://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                 window.mozRequestAnimationFrame    || 
                                 window.oRequestAnimationFrame      || 
                                 window.msRequestAnimationFrame     || 
                                 function(callback, element) {
                                   window.setTimeout(callback, 1000 / 60);
                                 }
}

Game = {

  ready: function() {
    var ready = [];
    document.addEventListener('DOMContentLoaded', function() {
      for(var n = 0 ; n < ready.length ; n++)
        ready[n]();
      ready = true;
    }, false);
    return function(fn) { (ready === true) ? fn() : ready.push(fn); };
  }(),

  //===========================================================================
  // GAME RUNNER
  //===========================================================================

  Runner: Class.create({

    initialize: function(id, game, cfg) {
      this.game          = game;
      this.cfg           = cfg || {};
      this.canvas        = $(id);
      this.bounds        = this.canvas.getBoundingClientRect();
      this.width         = this.cfg.width  || this.canvas.offsetWidth;
      this.height        = this.cfg.height || this.canvas.offsetHeight;
      this.canvas        = this.canvas;
      this.canvas.width  = this.width;
      this.canvas.height = this.height;
      this.ctx           = this.canvas.getContext('2d');
      this.addEvents();
      if (toBool(cfg.start))
        this.start();
    },

    start: function() {
      var timestamp = function() { return new Date().getTime(); };
      var dt, start, middle, end, last = timestamp(), stopping = false, self = this;
      var frame = function() {
        start  = timestamp(); self.update(Math.min(0.1, (start - last)/1000.0)); // send dt as seconds, MAX of 0.1s (to avoid huge delta's when requestAnimationFrame put us in the background)
        middle = timestamp(); self.draw();
        end    = timestamp();
        last   = start;
        if (!stopping)
          requestAnimationFrame(frame);
      }
      this.stop = function() { stopping = true; }
      frame();
    },

    update: function(dt) {
      dt = Math.min(dt, 500); // when tab is invisible, requestAnimationFrame doesn't fire, and we need to ensure we dont pass on huge dt values (> 500ms)
      this.game.update(dt);
    },

    draw: function() {
      this.ctx.save();
      this.game.draw(this.ctx);
      this.ctx.restore();
    },

    addEvents: function() {
      $(window).on('resize', this.onresize.bind(this));
      var game = this.game;
      if (game.onfocus) {
        document.body.tabIndex = toInt(document.body.tabIndex, 0); // body needs tabIndex to recieve focus
        $(document.body).on('focus', function(ev) { game.onfocus(ev); });
      }
      if (game.onclick) {
        $(document).on('click', function(ev) { game.onclick(ev); });
      }
    },

    onresize: function() {
      if (this.onresizeTimer)
        clearTimeout(this.onresizeTimer);
      this.onresizeTimer = setTimeout(this.onresizeend.bind(this), 50); // dont fire resize event until 50ms after user has stopped resizing (avoid flickering)
    },

    onresizeend: function() {
      this.resize();
    },

    resize: function() {
      if ((this.width != this.canvas.offsetWidth) || (this.height != this.canvas.offsetHeight)) {
        // console.log("CANVAS RESIZED " + this.canvas.offsetWidth + ", " + this.canvas.offsetHeight);
        this.width  = this.canvas.width  = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        if (this.game && this.game.onresize)
          this.game.onresize(this.width, this.height);
      }
    }

  }),

  //===========================================================================
  // UTILS
  //===========================================================================

  storage: function() {
    try {
      return this.localStorage = this.localStorage || window.localStorage || {};
    }
    catch(e) { // IE localStorage throws exceptions when using non-standard port (e.g. during development)
      return this.localStorage = {};
    }
  },

  renderToCanvas: function(width, height, render, canvas) { // https://kaioa.com/node/103
    canvas = canvas || document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    render(canvas.getContext('2d'));
    return canvas;
  },

  createImage: function(url, options) {
    options = options || {};
    var image = $({tag: 'img'});
    if (options.onload)
      image.on('load', options.onload);
    image.src = url;
    return image;
  },

  loadResources: function(images, sounds, callback) { /* load multiple images and sounds and callback when ALL have finished loading */
    images    = images || [];
    sounds    = sounds || [];
    var count = images.length + sounds.length;
    var resources = { images: {}, sounds: {} };
    if (count == 0) {
      callback(resources);
    }
    else {

      var done = false;
      var loaded = function() {
        if (!done) {
          done = true; // ensure only called once, either by onload, or by setTimeout
          callback(resources);
        }
      }

      var onload = function() {
        if (--count == 0)
          loaded();
      };

      for(var n = 0 ; n < images.length ; n++) {
        var image = images[n];
        image = is.string(image) ? { id: image, url: image } : image;
        resources.images[image.id] = Game.createImage(image.url, { onload: onload });
      }

      for(var n = 0 ; n < sounds.length ; n++) {
        var sound  = sounds[n];
        sound = is.string(sound) ? { id: sound, name: sound } : sound;
        resources.sounds[sound.id] = AudioFX(sound.name, sound, onload);
      }

      setTimeout(loaded, 4000); // need a timeout because HTML5 audio canplay event is VERY VERY FLAKEY (especially on slow connections)

    }
  }

};

//=============================================================================
// Minimal DOM Library ($)
//=============================================================================

Game.Element = function() {

  var query  = function(selector, context) {
    if (is.array(context))
      return Sizzle.matches(selector, context);
    else
      return Sizzle(selector, context);
  };

  var extend = function(obj)  {
    if (is.array(obj)) {
      for(var n = 0, l = obj.length ; n < l ; n++)
        obj[n] = extend(obj[n]);
    }
    else if (!obj._extended) {
      Object.extend(obj, Game.Element.instanceMethods);
    }
    return obj;
  };

  var on = function(ele, type, fn, capture) { ele.addEventListener(type, fn, capture);    };
  var un = function(ele, type, fn, capture) { ele.removeEventListener(type, fn, capture); };

  var create = function(attributes) {
    var ele = document.createElement(attributes.tag);
    for (var name in attributes) {
      if (attributes.hasOwnProperty(name) && is.valid(attributes[name])) {
        switch(name) {
          case 'tag'  : break;
          case 'html' : ele.innerHTML = attributes[name];  break;
          case 'text' : ele.appendChild(document.createTextNode(attributes[name])); break;
          case 'dom'  :
            attributes[name] = is.array(attributes[name]) ? attributes[name] : [attributes[name]];
            for (var n = 0 ; n < attributes[name].length ; n++)
              ele.appendChild(attributes[name][n]);
            break;
          case 'class':
          case 'klass':
          case 'className':
            ele.className = attributes[name];
            break;
          case 'on':
            for(var ename in attributes[name])
              on(ele, ename, attributes[name][ename]);
            break;
          default:
            ele.setAttribute(name, attributes[name]);
            break;
        }
      }
    }
    return ele;
  };

  return {
 
    all: function(selector, context) {
      return extend(query(selector, context));
    },

    get: function(obj, context) {
      if (is.string(obj))
        return extend(query("#" + obj, context)[0]);
      else if (is.element(obj) || is.window(obj) || is.document(obj))
        return extend(obj);
      else if (is.event(obj))
        return extend(obj.target || obj.srcElement);
      else if ((typeof obj == 'object') && obj.tag)
        return extend(create(obj));
      else
        throw "not an appropriate type for DOM wrapping: " + ele;
    },

    instanceMethods: {

      _extended: true,

      on: function(type, fn, capture) { on(this, type, fn, capture);    },
      un: function(type, fn, capture) { un(this, type, fn, capture);    },

      showIf:  function(on)      { if (on) this.show(); else this.hide(); },
      show:    function()        { this.style.display = ''       },
      hide:    function()        { this.style.display = 'none';  },
      visible: function()        { return (this.style.display != 'none') && !this.fading; },
      fade:    function(amount)  { this.style.opacity = amount;  },

      relations: function(property, includeSelf) {
        var result = includeSelf ? [this] : [], ele = this;
        while(ele = ele[property])
          if (ele.nodeType == 1)
            result.push(ele);
        return extend(result); 
      },

      parent:            function()            { return extend(this.parentNode); },
      ancestors:         function(includeSelf) { return this.relations('parentNode', includeSelf); },
      previousSiblings:  function()            { return this.relations('previousSibling');         },
      nextSiblings:      function()            { return this.relations('nextSibling');             },

      select: function(selector)            { return Game.Element.all(selector, this); },
      down: function(selector)              { return Game.Element.all(selector, this)[0]; },
      up:   function(selector, includeSelf) { return Game.Element.all(selector, this.ancestors(includeSelf))[0]; },
      prev: function(selector)              { return Game.Element.all(selector, this.previousSiblings())[0];     },
      next: function(selector)              { return Game.Element.all(selector, this.nextSiblings())[0];         },

      remove: function() {
        if (this.parentNode)
          this.parentNode.removeChild(this);
        return this;
      },

      removeChildren: function() { // NOTE: can't use :clear because its in DOM level-1 and IE bitches if we try to provide our own
        while (this.childNodes.length > 0)
          this.removeChild(this.childNodes[0]);
        return this;
      },

      update: function(content) {
        this.innerHTML = "";
        this.append(content);
      },
          
      append: function(content) {
        if (is.string(content))
          this.innerHTML += content;
        else if (is.array(content))
          for(var n = 0 ; n < content.length ; n++)
            this.append(content[n]);
        else
          this.appendChild(Game.Element.get(content));
      },

      setClassName:    function(name)     { this.className = name; },
      hasClassName:    function(name)     { return (new RegExp("(^|\s*)" + name + "(\s*|$)")).test(this.className) },
      addClassName:    function(name)     { this.toggleClassName(name, true);  },
      removeClassName: function(name)     { this.toggleClassName(name, false); },
      toggleClassName: function(name, on) {
        var classes = this.className.split(' ');
        var n = classes.indexOf(name);
        on = (typeof on == 'undefined') ? (n < 0) : on;
        if (on && (n < 0))
          classes.push(name);
        else if (!on && (n >= 0))
          classes.splice(n, 1);
        this.className = classes.join(' ');
      },

      fadeout: function(options) {
        options = options || {};
        this.cancelFade();
        this.fading = Animator.apply(this, 'opacity: 0', { duration: options.duration, onComplete: function() {
          this.hide();
          this.fading = null;
          this.style.opacity = is.ie ? 1 : null; /* clear opacity after hiding, but IE doesn't allow clear so set to 1.0 for IE */
          if (options.onComplete)
            options.onComplete();
        }.bind(this) });
        this.fading.play();
      },

      fadein: function(options) {
        options = options || {};
        this.cancelFade();
        this.style.opacity = 0;
        this.show();
        this.fading = Animator.apply(this, 'opacity: 1', { duration: options.duration, onComplete: function() {
          this.fading = null;
          this.style.opacity = is.ie ? 1 : null; /* clear opacity after hiding, but IE doesn't allow clear so set to 1.0 for IE */
          if (options.onComplete)
            options.onComplete();
        }.bind(this) });
        this.fading.play();
      },

      cancelFade: function() {
        if (this.fading) {
          this.fading.stop();
          delete this.fading;
        }
      }

    }
  };

}();

$ = Game.Element.get;
$$ = Game.Element.all;

Game.Event = {

  stop: function(ev) {
    ev.preventDefault();
    ev.cancelBubble = true;
    ev.returnValue = false;
    return false;
  }

}

Game.Menu = Class.create({

  initialize: function(element, game, cfg) {
    this.parent = $(element);
    this.game = game;
    this.cfg  = cfg;
    this.construct(cfg.id, cfg.items, toBool(cfg.visible, true));
    Game.Key.map([
      { keys: [Game.Key.UP,    Game.Key.W],      mode: 'down', action: function() { this.prev();           } },
      { keys: [Game.Key.DOWN,  Game.Key.S],      mode: 'down', action: function() { this.next();           } },
      { keys: [Game.Key.LEFT,  Game.Key.A],      mode: 'down', action: function() { this.prevChoice();     } },
      { keys: [Game.Key.RIGHT, Game.Key.D],      mode: 'down', action: function() { this.nextChoice();     } },
      { keys: [Game.Key.SPACE, Game.Key.RETURN], mode: 'down', action: function() { this.click();          } }
    ], this, { ele: this.dom });
  },

  destruct: function() {
    if (this.dom) {
      this.dom.remove();
      this.dom = null;
      this.items = null;
    }
  },

  construct: function(id, items, visible) {
    var style = visible ? "" : "display: none;";
    this.destruct();
    this.dom = $({tag: 'div', id: id, klass: 'menu', style: style, on: {
      mousemove: this.onmousemove.bind(this),
      click:     this.onclick.bind(this)
    }});
    this.tabindex = 10;
    this.items = [];
    for(var n = 0 ; n < items.length ; n++)
      this.items.push(this.constructItem(n, items[n]));
    this.parent.append(this.dom);
    this.select(0);
  },

  constructItem: function(n, cfg) {
    var item = $({tag: "span", klass: "item", style: "cursor: pointer;",
      text:     cfg.text,
      title:    cfg.title,
      id:    	cfg.id,
      tabindex: cfg.tabindex || this.tabindex++,
      on: {
        focus: this.onfocusitem.bind(this)
      }
    });
    item.cfg = cfg;
    item.index = n;
    item.action = cfg.choice ? this.nextChoice.bind(this, item, true) : cfg.action;
    this.setChoice(item, cfg.chosen);
    this.dom.append({tag: "div", dom: item});
    return item;
  },

  prevChoice: function(item, wrap) {
    item = item || this.selectedItem();
    if (item.cfg.choice) {
      if (item.cfg.chosen > 0)
        this.setChoice(item, item.cfg.chosen - 1);
      else if (wrap)
        this.setChoice(item, item.cfg.choice.length - 1);
    }
  },

  nextChoice: function(item, wrap) {
    item = item || this.selectedItem();
    if (item.cfg.choice) {
      if (item.cfg.chosen < (item.cfg.choice.length - 1))
        this.setChoice(item, item.cfg.chosen + 1);
      else if (wrap)
        this.setChoice(item, 0);
    }
  },

  setChoice: function(item, n) {
    if (item.cfg.choice) {
      var choice = item.cfg.choice;
      var chosen = item.cfg.chosen = toInt(n, 0);

      var label = $({tag: 'span', klass: 'choice', text: item.cfg.choice[chosen]});
      var prev  = $({tag: 'span', klass: 'prev',   text: (chosen==0               ? "" : "<")});
      var next  = $({tag: 'span', klass: 'next',   text: (chosen==choice.length-1 ? "" : ">")});

      if (chosen > 0)
        prev.on('click',  function(e) { this.prevChoice(item, false); Game.Event.stop(e); }.bind(this));
      if (chosen < choice.length-1)
        next.on('click', function(e) { this.nextChoice(item, false); Game.Event.stop(e); }.bind(this));

      item.update([prev, label, next]);
      item.cfg.action.call(this.game, item.cfg.chosen);
    }
  },

  item:          function(ev) { return $(ev).up('.item', true);      },
  selectedItem:  function()   { return this.dom.down('.selected');   },
  selectedIndex: function()   { return this.selectedItem().index;    },
  firstItem:     function()   { return this.dom.down('.item:first'); },
  lastItem:      function()   { return this.dom.down('.item:last');  },

  onfocusitem: function(ev) { this.select(this.item(ev)); },
  onmousemove: function(ev) { this.select(this.item(ev)); },

  prev: function()  { this.select(this.selectedIndex() - 1); },
  next: function()  { this.select(this.selectedIndex() + 1); },

  click: function() {  
    var item = this.selectedItem();
    if (item && item.action) {
      if (this.cfg.onclick)
        this.cfg.onclick.call(this.game, item);
      item.action.call(this.game);
    }
  },

  onclick: function(ev) {
    if (this.dom.visible())
      this.click(this.item(ev));
    return Game.Event.stop(ev);
  },

  select: function(obj) {
    if (is.valid(obj)) {
      var selected = this.selectedItem();
      var item     = is.number(obj) ? this.items[Math.min(Math.max(obj, 0), this.items.length-1)] : obj;
      if (selected != item) {
        if (selected)
          selected.removeClassName('selected');
        if (item) {
          item.addClassName('selected');
          item.focus();
        }
        if (this.dom.visible() && this.cfg.onselect)
          this.cfg.onselect.call(this.game, selected);
      }
    }
  },

  focus: function() {
    this.selectedItem().focus();
  },

  hide: function() {
    this.dom.hide();
  },

  show: function() {
    this.dom.show();
    this.selectedItem().focus();
  },

  fadeout: function(options) {
    this.dom.fadeout(options);
  },

  fadein: function(options) {
    options = options || {};
    var cb = options.onComplete;
    options.onComplete = function() {
      this.selectedItem().focus();
      if (cb)
        cb();
    }.bind(this);
    this.dom.fadein(options);
  }

});


Game.Key = {
  BACKSPACE: 8,
  TAB:       9,
  RETURN:   13,
  ESC:      27,
  SPACE:    32,
  END:      35,
  HOME:     36,
  LEFT:     37,
  UP:       38,
  RIGHT:    39,
  DOWN:     40,
  PAGEUP:   33,
  PAGEDOWN: 34,
  INSERT:   45,
  DELETE:   46,
  ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
  A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
  TILDA:    192,

  map: function(map, context, cfg) {
    cfg = cfg || {};
    var ele = $(cfg.ele || document);
    var onkey = function(ev, keyCode, mode) {
      var n, k, i;
      if ((ele === document) || ele.visible()) {
        for(n = 0 ; n < map.length ; ++n) {
          k = map[n];
          k.mode = k.mode || 'up';
          if (Game.Key.match(k, keyCode, mode, context)) {
            k.action.call(context, keyCode);
            return Game.Event.stop(ev);
          }
        }
      }
    };
    ele.on('keydown', function(ev) { return onkey(ev, ev.keyCode, 'down'); });
    ele.on('keyup',   function(ev) { return onkey(ev, ev.keyCode, 'up');   });
  },

  match: function(map, keyCode, mode, context) {
    if (map.mode === mode) {
      if (!map.state || !context || (map.state === context.current)) {
        if ((map.key === keyCode) || (map.keys && (map.keys.indexOf(keyCode) >= 0))) {
          return true;
        }
      }
    }
    return false;
  }

};


Game.Math = {

  THREESIXTY: Math.PI * 2,

  minmax: function(x, min, max) {
    return Math.max(min, Math.min(max, x));
  },

  random: function(min, max) {
    return (min + (Math.random() * (max - min)));
  },

  randomChoice: function(choices) {
    return choices[Math.round(Game.random(0, choices.length-1))];
  },

  randomBool: function() {
    return Game.randomChoice([true, false]);
  },

  between: function(x, from, to) {
    return ((from <= x) && (x <= to));
  },

  brighten: function(hex, percent) {
    var r = parseInt(hex.substr(1, 2), 16),
        g = parseInt(hex.substr(3, 2), 16),
        b = parseInt(hex.substr(5, 2), 16);
    return '#' +
     ((0|(1<<8) + r + (256-r) * percent/100).toString(16)).substr(1) +
     ((0|(1<<8) + g + (256-g) * percent/100).toString(16)).substr(1) +
     ((0|(1<<8) + b + (256-b) * percent/100).toString(16)).substr(1);
  },

  bound: function(box) {
    if (box.radius) {
      box.w      = 2 * box.radius;
      box.h      = 2 * box.radius;
      box.left   = box.x - box.radius;
      box.right  = box.x + box.radius;
      box.top    = box.y - box.radius;
      box.bottom = box.y + box.radius;
    }
    else {
      box.left   = box.x;
      box.right  = box.x + box.w;
      box.top    = box.y;
      box.bottom = box.y + box.h;
    }
    return box;
  },

  overlap: function(box1, box2, returnOverlap) {
    if ((box1.right < box2.left)   ||
        (box1.left  > box2.right)  ||
        (box1.top   > box2.bottom) ||
        (box1.bottom < box2.top)) {
      return false;
    }
    else {
      if (returnOverlap) {
        var left   = Math.max(box1.left,  box2.left);
        var right  = Math.min(box1.right, box2.right);
        var top    = Math.max(box1.top,   box2.top);
        var bottom = Math.min(box1.bottom, box2.bottom);
        return {x: left, y: top, w: right-left, h: bottom-top, left: left, right: right, top: top, bottom: bottom };
      }
      else {
        return true;
      }
    }
  },

  normalize: function(vec, m) {
    vec.m = this.magnitude(vec.x, vec.y);
    if (vec.m == 0) {
      vec.x = vec.y = vec.m = 0;
    }
    else {
      vec.m = vec.m / (m || 1);
      vec.x = vec.x / vec.m;
      vec.y = vec.y / vec.m;
      vec.m = vec.m / vec.m;
    }
    return vec; 
  },

  magnitude: function(x, y) {
    return Math.sqrt(x*x + y*y);
  },

  move: function(x, y, dx, dy, dt) {
    var nx = dx * dt;
    var ny = dy * dt;
    return { x: x + nx, y: y + ny, dx: dx, dy: dy, nx: nx, ny: ny };
  },

  accelerate: function(x, y, dx, dy, accel, dt) {
    var x2  = x + (dt * dx) + (accel * dt * dt * 0.5);
    var y2  = y + (dt * dy) + (accel * dt * dt * 0.5);
    var dx2 = dx + (accel * dt) * (dx > 0 ? 1 : -1);
    var dy2 = dy + (accel * dt) * (dy > 0 ? 1 : -1);
    return { nx: (x2-x), ny: (y2-y), x: x2, y: y2, dx: dx2, dy: dy2 };
  },

  intercept: function(x1, y1, x2, y2, x3, y3, x4, y4, d) {
    var denom = ((y4-y3) * (x2-x1)) - ((x4-x3) * (y2-y1));
    if (denom != 0) {
      var ua = (((x4-x3) * (y1-y3)) - ((y4-y3) * (x1-x3))) / denom;
      if ((ua >= 0) && (ua <= 1)) {
        var ub = (((x2-x1) * (y1-y3)) - ((y2-y1) * (x1-x3))) / denom;
        if ((ub >= 0) && (ub <= 1)) {
          var x = x1 + (ua * (x2-x1));
          var y = y1 + (ua * (y2-y1));
          return { x: x, y: y, d: d};
        }
      }
    }
    return null;
  },

  ballIntercept: function(ball, rect, nx, ny) {
    var pt;
    if (nx < 0) {
      pt = Game.Math.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                               rect.right  + ball.radius, 
                               rect.top    - ball.radius, 
                               rect.right  + ball.radius, 
                               rect.bottom + ball.radius, 
                               "right");
    }
    else if (nx > 0) {
      pt = Game.Math.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                               rect.left   - ball.radius, 
                               rect.top    - ball.radius, 
                               rect.left   - ball.radius, 
                               rect.bottom + ball.radius,
                               "left");
    }
    if (!pt) {
      if (ny < 0) {
        pt = Game.Math.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                 rect.left   - ball.radius, 
                                 rect.bottom + ball.radius, 
                                 rect.right  + ball.radius, 
                                 rect.bottom + ball.radius,
                                 "bottom");
      }
      else if (ny > 0) {
        pt = Game.Math.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                 rect.left   - ball.radius, 
                                 rect.top    - ball.radius, 
                                 rect.right  + ball.radius, 
                                 rect.top    - ball.radius,
                                 "top");
      }
    }
    return pt;
  }

}

Game.Vector = Game.Point = Class.create({

  initialize: function(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  },

  equals: function(other) { return ((this.x == other.x) && (this.y == other.y)); },
  blank:  function()      { return (is.invalid(this.x) || is.invalid(this.y));   }

});



