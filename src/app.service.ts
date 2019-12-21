import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getIndex(): string {
    return `
      <!doctype html>
      <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono&display=swap" rel="stylesheet">
      <style>
        body > div {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 50%;
        }

        body > div:first-of-type {
          left: 0;
        }

        body > div:last-of-type {
          right: 0;
        }

        body > div > div, body > div > textarea {
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 2em;
          width: 100%;
          border: 0.25em solid #808080;
          padding: 0.5em;
          resize: none;
          overflow-x: hidden;
          overflow-y: auto;
        }

        body > div > button {
          box-sizing: border-box;
          position: absolute;
          bottom: 2em;
          right: 2em;
          width: 3em;
          padding: 0.5em 0;
          text-align: center;
          border: 0.25em solid #808080;
          border-radius: 100%;
        }

        body > div > span {
          position: absolute;
          bottom: 2em;
          left: 2em;
          padding: 0.25em 0.5em;
          font-size: 60%;
        }

        body *:focus {
          border-color: #8080ff;
          outline: none;
        }

        body, textarea, button, input, select, pre, code {
          line-height: 1.5;
          font-size: 18px;
          font-family: 'IBM Plex Mono', Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', Monaco, 'Courier New', Courier, monospace;
          color: #404040;
        }
      </style>
      <script>
        function handleTab(e){
          var el = e.target;
          if (e.keyCode==75 || e.which==75) {
            if (e.metaKey) {
              el.value = ''
            }
          }
          else if (e.keyCode==13 || e.which==13) {
            if (e.ctrlKey || e.metaKey) {
              el.nextElementSibling.click()
            }
          }
          else if(e.keyCode==9 || e.which==9){
            e.preventDefault();
            var selStart = el.selectionStart;
            var selEnd = el.selectionEnd;
            var start = el.value.lastIndexOf("\\n", selStart) + 1
            var end = el.value.indexOf("\\n", selStart)
            var pos = 0
            if (end === -1) {
              end = el.value.length
            }
            var line = el.value.substring(start, end)
            if (e.shiftKey) {
              if (line[0] === ' ') {
                if (line[1] === ' ') {
                  line = line.substring(2)
                  pos -= 2
                }
                else {
                  line = line.substring(1)
                  pos -= 1
                }
              }
            }
            else {
              line = "  " + line
              pos += 2
            }
            el.value = el.value.substring(0, start) + line + el.value.substring(end);
            el.selectionStart = selStart + pos;
            el.selectionEnd = selEnd + pos;
          }
        }
        function doRun(query) {
          fetch('/query', {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify({ query: query })
          }).then(response => response.text()).then(appendOutput)
        }
        function appendOutput(data) {
          var el = document.createElement('pre')
          el.innerText = data
          document.getElementById("output").appendChild(el)
        }
      </script>
      <body>
        <div>
          <textarea autofocus placeholder="Input program" onkeydown="handleTab(event)"></textarea>
          <button onclick="doRun(event.target.previousElementSibling.value)">Run</button>
          <span>indent { tab } dedent { ⇧tab } clear { ⌘ K } go { ⌘ return }</span>
        </div>
        <div>
          <div tabindex="0" id="output">
            Output
          </div>
        </div>
      </body>
    `;
  }

  postQuery(query: string) {
    return 'I am not implemented';
  }
}
