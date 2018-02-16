import React, {Component} from 'react';
import {ScrollView, Text, TouchableOpacity, Dimensions} from 'react-native';
import HTML from 'react-native-render-html';
import {IGNORED_TAGS} from 'react-native-render-html/src/HTMLUtils';
import {_constructStyles} from 'react-native-render-html/src/HTMLStyles';

const htmlContent = `
    <br/>
    <a href="https://nyby.no">nyby.no</a>    
    <blockquote>This is a quote</blockquote>
    <em>&lt;em/&gt; Tag</em>
    <img src="http://nyby.no/images/logo.png" />
    <ol>
    <li>one</li>
    <li>two</li>
    </ol>
    <p>A paragraph</p>
    <div style="border-width: 1px; textAlign: center;">Strong</div>
    <hr style="margin: 10px"/>
    <ul>
    <li>one</li>
    <li>two</li>
    </ul>
    <h1>Ignored</h1>
    <span style="color: green">
    <em>Mixed <strong style="color:purple">content</strong></em></span>
    <button style="border-width: 1px; border-color: red; 
            border-radius: 10px; padding: 10px; text-align: center; 
            textAlign: center; width:200px;left:50%;margin-left:-100px;"
            formaction="https://nyby.no/events?id=123"><strong>Click me</strong></button>

`;

const ALLOWED_TAGS = ['a', 'blockquote', 'br', 'button', 'div', 'em', 'hr', 'img',
    'li', 'ol', 'p', 'span', 'strong', 'sub', 'sup', 'u', 'ul'];

const HasHtml = new RegExp('<([A-Za-z][A-Za-z0-9]*)[^>]*>');

/**
 * @returns {boolean}
 */
function HtmlIgnoreTags(node) {
    if (node.type === 'tag') {
        const tag = node.name && node.name.toLowerCase();
        return ALLOWED_TAGS.indexOf(tag) < 0;
    }
    return false;
}

function ButtonRenderer(htmlAttribs, children, convertedCSSStyles, passProps) {
    const style = _constructStyles({
        tagName: 'a',
        htmlAttribs,
        passProps,
        styleSet: 'VIEW'
    });
    console.log(style);
    const {key, data} = passProps;
    const onPress = (evt) => {
        if (htmlAttribs && htmlAttribs.formaction) {
            console.log(htmlAttribs.formaction, htmlAttribs);
        }
    };
    return (
        <TouchableOpacity onPress={onPress} key={key} style={style}>
            {children || data}
        </TouchableOpacity>
    );
}

function renderMessage(content) {
    if (!HasHtml.test(content)) {
        return <Text>{content}</Text>;
    }
    return (
        <HTML html={content}
              textSelectable={true}
              renderers={{button: ButtonRenderer}}
              ignoredTags={IGNORED_TAGS.filter(t => t !== 'button')}
              ignoreNodesFunction={HtmlIgnoreTags}
              imagesMaxWidth={Dimensions.get('window').width}/>
    );
}

export default class Demo extends Component {
    render() {
        return (
            <ScrollView style={{flex: 1}}>
                {renderMessage(htmlContent)}
            </ScrollView>
        );
    }
}
