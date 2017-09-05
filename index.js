var tesseract = require('node-tesseract');
var speak = require('simple-tts');
var pdf2image = require('pdf2image');
var contador = 1;
var estadoEspaco = 0;

//Pega os parametros passados via CLI
var myArgs = process.argv.slice(2);

var parametro_nome_arquivo_pdf = myArgs[0];

var parametro_nome_arquivo_de_saida = myArgs[1];

var imgoption = 2;

var pathy;

var mp3filename;


if(parametro_nome_arquivo_pdf==undefined){
    pdffilename = "test.pdf";
}else{
    pdffilename = parametro_nome_arquivo_pdf;
}


if(parametro_nome_arquivo_de_saida==undefined){
    mp3filename = "audio";
}else{
    mp3filename = parametro_nome_arquivo_de_saida;
}


console.log(pdffilename);

console.log(mp3filename);

//converts all the pages of the given pdf using the default options

var imgconvertida = "";


function executa(){
return new Promise(function (resolve, reject) {
          pdf2image.convertPDF(pdffilename).then(
              function(pageList){

                  pageList.forEach(function(item){

                    //console.log(item);

                    imgconvertida = "/"+item.path;
                    var nomeDaSaida = mp3filename+""+contador;
                    contador = contador+1;
                        converteImagemEmMP3(imgconvertida,nomeDaSaida);

                  });

              }
          ).then(function(){

          });
      })

}


executa();



function converteImagemEmMP3(imagemDaVez,nomeDaSaida){

  console.log("converteImagemEmMP3");

  pathy = imagemDaVez;

  // Recognize text of any language in any format
  tesseract.process(__dirname + pathy,function(err, text) {
      if(err) {
          console.log("deu ruim");
          console.error(err);
      } else {

          console.log("convertendo...");

          var text3 = limpa(text);

          texto_to_mp3(text3,nomeDaSaida);
      }
  });
}

function verificaSeCaracterEValidoViaPattern(caracterDaVez,pattern){
  var auxCaracter = caracterDaVez+"";
  if(auxCaracter.match(pattern)){
    return true;
  }else{
    return false;
  }
}


function verificaSeCaracterIgualA(caracterDaVez,caracterComparacao){
  if(caracterDaVez==caracterComparacao){
    return true;
  }else{
    return false;
  }
}

function verificaSeEUmCaracterValido(caracterDaVez)
{
    if (
         (verificaSeCaracterEValidoViaPattern(caracterDaVez,"[a-zA-Z_]"))

         ||

         (verificaSeCaracterEValidoViaPattern(caracterDaVez,"[0-9]"))
       )
    {
       estadoEspaco = 0;
       return "caracterValido";
    }

    else if(
            ((verificaSeCaracterIgualA(caracterDaVez," "))&&(estadoEspaco==0))

            ||

            ((verificaSeCaracterIgualA(caracterDaVez,"\n")))

            ||

            ((verificaSeCaracterIgualA(caracterDaVez,"\r")))
           )

    {
      return "espacamentoDeCaracteres";
    }

    else

    {
       return "caracterInvalido";
    }

}


function limpa(texto)
{
    var arraydechar = texto.split('');

    var novo_array = arraydechar.map(function(caracter)
    {
        var eOuNaoValido = verificaSeEUmCaracterValido(caracter)

        if(eOuNaoValido=="caracterValido"){
          estadoEspaco = 0;
          return caracter;
        }

        else if((eOuNaoValido=="espacamentoDeCaracteres")&&(estadoEspaco==0))
        {
          estadoEspaco = 1;
          return " ";
        }

        else
        {
          return "";
        }
    });

    estadoEspaco = 0;

    var textolimpo = novo_array.join('');

    return textolimpo;

}


function removerAcentos( newStringComAcento ) {
  var string = newStringComAcento;
	var mapaAcentosHex 	= {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		c : /\xE7/g,
   '-' : /\s/g,
		n : /\xF1/g
	};

	for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}

	return string;
}




function texto_to_mp3(texto,nomeDaSaida){

    console.log(texto);

    speak(texto, { lang:'pt-br', format:'mp3', filename: nomeDaSaida});

}



