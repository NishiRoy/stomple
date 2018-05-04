var colors = [];
var previousClicked = [];
var turn = 0;
var UserColor='';
var UserNumber = 0;
            $(document).ready(function(){
                var socket = io(); //1
                

            socket.on('board',function(data){
                UserColor=data.usercolor;
                UserNumber = data.userNumber;
                console.log("This user's color is",UserColor);
                console.log("User Number is", data.userNumber);
               for(var i=0;i<49;i++){
                   colors.push(data.colors[i])
                }
                    var html_str='';
                    var ids=0;
                    html_str+="<table>"
                    for(var i=0;i<7;i++){
                        html_str+="<tr>"
                        for(var j=0;j<7;j++){
                            html_str+="<td><div id='"+ids+"' class='circleBase type2 "+colors[ids]+"'></div></td>"
                            ids++;
                        }
                        html_str+="</tr>"
                    }
                    html_str+="</table>"
                    $('#board').html(html_str);
            })
           
           

          
           socket.emit('create_new_gamer');
    
                socket.on('greeting', function (data) { //4
                    console.log(data.msg); //5
                    socket.emit('thankyou', { msg: 'Thank you for connecting me! -Client' }); //6
                });

            $('button').click(function(e){
                $('#turnS').html();
                socket.emit('pass_turn');
            })

            $('div').click(function(e){
                clicked=e.target.id;
                console.log(colors[clicked]);           

            //    if (previousClicked[UserNumber] === null || previousClicked[UserNumber] === undefined )
            //    {
            //     previousClicked[UserNumber] = clicked;
            //     console.log ("first  pre click", previousClicked[turn]);
            //     console.log ("hey");
            //    }
              if (previousClicked[UserNumber] === null || previousClicked[UserNumber] === undefined)
              {                  
                if(colors[clicked]==UserColor)
                {
                    console.log("The colors are same");
                    alert('Pick a different marble to stomple');                   
                }
                else
                {
                    console.log('this is my first click');
                    console.log('User Number', UserNumber);
                    socket.emit('clicked',{id:clicked});                  
                }
                previousClicked[UserNumber] = clicked;
                console.log ("Previous Assigned", UserNumber, previousClicked[UserNumber]);                     
              }
              else 
              {
                console.log('first else', clicked, previousClicked[UserNumber]);

                if ( 
                    (clicked == previousClicked[UserNumber])
                    ||
                    ((clicked == previousClicked[UserNumber]+1) || (clicked == previousClicked[UserNumber]-1))
                    ||
                    (   ((previousClicked[UserNumber] +7) < 49) 
                        && 
                        ((clicked == previousClicked[UserNumber]+7) || (clicked == previousClicked[UserNumber]+7+1) || (clicked == previousClicked[UserNumber]+7-1))
                    )
                    ||
                    (
                        ((previousClicked[UserNumber] - 7) > 0) 
                        && 
                        ((clicked == previousClicked[UserNumber]-7) ||  (clicked == previousClicked[UserNumber]-7+1) || (clicked == previousClicked[UserNumber]-7-1))
                    )
                ) 
                {
                    console.log(clicked, previousClicked[UserNumber]);
                    socket.emit('clicked',{id:clicked});
                }
                else
                {
                    console.log(clicked, previousClicked[UserNumber]);
                    alert('Not an adjacent color');
                    
                }
                previousClicked[UserNumber] = clicked;
                console.log ("Previous Assigned", UserNumber, previousClicked[UserNumber]);      
              }             
               
                
            });
            
            socket.on('update_color', function (data) { //4                   
                    $col='black';
                    $(document.getElementById(data.id)).animate({
                    backgroundColor: $col,
                    }, 'slow');
                
                });

            socket.on('your_turn',function(){
                console.log('it');
                var html="";
                $('#turnS').html("<p> Your Turn</p>");

            })

         

        })