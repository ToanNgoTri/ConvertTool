import "./App.css";
import { Database, getDatabase, ref, child, get, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { app } from "./Firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getDatabase, ref, onValue  } from "firebase/database";

// xử lý chương, điều, phần có dấu ngoặc )(,][,}{

function App() {      // dưới 3 phần tử trong luật sẽ bị lỗi vd dưới 3 chương, phần thứ n
  function covert() {
    let input = document.querySelector(".input").value;

    let i0 = input.replace(/^Điều (\d+)\.(.*)/gm, "Điều $1:$2")
    // điều . thành điều:

    let i1 = i0.replace(/^Điều (.*)\./gm, "Điều $1")
    // Bỏ . ở cuối hàng trong Điều


    let i2 = i1.replace(/^(\s)*(.*)/gm, "$2");
    // đề phòng có khoảng trống đầu hàng, cut it

    let i3 = i2.replace(/^\n/gm, "");
    // bỏ khoảng trống giữa các row
    // console.log(i3);
    let i4;
    if (!i3.match(/^Mục.*(:|\.).*\w$/gmi)) {
      i4 = i3.replace(/^Mục (.*)\n(.*)/gim, "Mục $1: $2");
      // kết nối "mục với nội dung "mục", trường hợp bị tách 2 hàng
    } else {
      i4 = i3;
    }

    let i5 = i4.replace(/^mục(.*)\n/gim, "");
    // bỏ mục đi

    let i6 = i5.replace(/(\[|\()\d*(\]|\))/gim, "");
    // bỏ chỉ mục số đi


    let i7;
      // i6 = i5.replace(/^Chương (.*)\n(.*)/gim, "Chương $1: $2");

      let i7a = []
      let initial = 4 // số dòng tối đa mặc định có thể bị xuống dòng làm cho phần 'chương' không được gộp 
                      // thành 1 dòng (có thể thay đổi để phù hợp tình hình)

      for(let b = 0;b<initial; b++ ){
        if(!b){
          i7a[b] = i6.replace(/(?<=^Chương.*)\n(?!Điều \d.*)/gmi, ": ");

        }else{
          i7a[b] = i7a[b-1].replace(/(?<=^Chương.*)\n(?!Điều \d.*)/gmi, " ");
        }
      }

      i7= i7a[initial-1]
    

    let i8 = i7.replace(/^Chương (.*)\./gim, "Chương $1");  
    // bỏ dấu chấm sau chương


    let i9;
    // if (!i7.match(/^Phần thứ(.*):(.+)(\w)/gmi)) { // phần chwua được gộp 
      // kết nối "Phần thứ với nội dung "phần thứ ...", trường hợp bị tách 2 hàng

      let i9a = []

      for(let c = 0;c<initial; c++ ){
        if(!c){
          i9a[c] = i8.replace(/(?<=^Phần thứ.*)\n(?!((điều \d.*)|(chương.*)))/gmi, ": ");
        }else{
          i9a[c] = i9a[c-1].replace(/(?<=^Phần thứ.*)\n(?!((điều \d.*)|(chương.*)))/gmi, " ");
        }
        
      }
      i9= i9a[initial-1]
      // i8 = i7.replace(/(?<=^Phần thứ.*)\n(?!điều.*)/gmi, ": ");


      let i10 = i9.replace(/\((.*)\)/gmi, "\($1\)");

    document.querySelector(".output").value = i9;


    let data =[];
if(!i8.match(/^phần thứ.*/gmi)){                                            // nếu không có phần thứ ...
    let chapterArray;   // lấy riêng lẻ từng chương thành 1 array
    if (i9.match(/^Chương.*$/gim)) {
      chapterArray = i9.match(/^Chương.*$/gim);
      // console.log(chapterArray);
    } else {
      chapterArray = null;
    }
    let articleArray ;  // lấy khoảng giữa các chương
    let allArticle = [];  // lấy riêng lẻ các điều
    let point = []
    let d=-1
    for (var a = 0; a < chapterArray.length; a++) {
      // data[chapterArray[a]] = {};
      articleArray = [];
      // let everyArticle = [];
      if (a < chapterArray.length - 1) {
        let replace = `(?<=${chapterArray[a]}\n)(.*\n)*(?=${chapterArray[a + 1]})`;
        let re = new RegExp(replace, "gim");
        articleArray = i9.match(re);
      } else {
        let replace = `((?<=${chapterArray[a]}))((\n.*)*)$`;
        let re = new RegExp(replace, "gim");
        articleArray = i9.match(re);
      }

      if (articleArray[0].match(/^Điều \d+(.*)$/gim)) {
        data[a] = {[chapterArray[a]]:articleArray[0].match(/^Điều \d+(.*)$/gim)}
        allArticle.push(articleArray[0].match(/^Điều \d+(.*)$/gim));
      } 
      else{
        // everyArticle = null
      }

      let countArticle = allArticle[a].length;
      // console.log(data[chapterArray[a]]);
      let b1;
      for(let b=0;b<countArticle;b++){
        b1=b
        // let replace = `(?<=${allArticle[a][b]}\n)(.*\n)*(?=${allArticle[a][b+1]})`;
        // let re = new RegExp(replace, "gm");
        // point.push(articleArray[0].match(re));
          if( b < countArticle-1 ){
            let replace = `(?<=${allArticle[a][b]}\n)(.*\n)*(?=${allArticle[a][b+1]})`;
            let re = new RegExp(replace, "gim");
            point.push(articleArray[0].match(re));
            // sửa lại
          }else{
            let replace = `(?<=${allArticle[a][b]}\n)((.*\n.*)*).*`;
            let re = new RegExp(replace, "im");
            point.push(articleArray[0].match(re));
          }
            // console.log(data[a][c]);
            
          }
          for(let b=0;b<countArticle;b++){

            
            for(let c = 0 ; c < 1;c++){
              d++;
              
              // data[chapterArray[a]][b] = {[data[chapterArray[a]][b]]:point[d][0]}
              data[a][chapterArray[a]][b] = {[data[a][chapterArray[a]][b]]:point[d][0]}
              // console.log(data[chapterArray[a]][b]);
              
            }
            
            // data[chapterArray[a]][allArticle[a][b]] = point[d][0];


            // console.log('allArticle[a][b]',allArticle[a][b]);
        }
      // console.log(countArticle);
      // console.log("articleArray", articleArray);

    }
    // console.log('point',point);
    // let m = data['Chương I: NHỮNG QUY ĐỊNH CHUNG'][0]
    // data['Chương I: NHỮNG QUY ĐỊNH CHUNG'][0] = {[m]:[]}
    // console.log('point',point);
    // console.log('allArticle',allArticle);

  }else{//////////////////////////////////////////////////////////////////////////////////////////////  // nếu có phần thứ ...

    let sectionArray;

    
    if (i9.match(/^phần thứ.*$/gmi)) {
      sectionArray = i9.match(/^phần thứ.*$/gmi);
      // console.log(chapterArray);
    } else {
      sectionArray = null;
    }

    // console.log('sectionArray',sectionArray);
    
    let ContentInEachSection ;  // lấy khoảng giữa các phần
    data = []
    
    let point = []
    for (var a = 0; a < sectionArray.length; a++) {
      ContentInEachSection = [];
      if (a < sectionArray.length - 1) {
        let replace = `(?<=${sectionArray[a]}\n)(.*\n)*(?=${sectionArray[a + 1]})`;
        let re = new RegExp(replace, "gim");
        ContentInEachSection = i9.match(re);
      } else {
        let replace = `((?<=${sectionArray[a]}))((\n.*)*)$`;
        let re = new RegExp(replace, "gim");
        ContentInEachSection = i9.match(re);
      }

      let chapterArray = []   // mảng có từng chapter riêng lẻ
      let articleArray =[]    // mảng có từng Điều riêng lẻ

      // console.log(ContentInEachSection[0].match(/^Chương.*$/igm));
      // console.log('ContentInEachSection',ContentInEachSection[0]);

    // if(0){   // nếu mà trong 'phần thứ...' có chương
      if(ContentInEachSection[0].match(/^Chương.*$/igm)){   // nếu mà trong 'phần thứ...' có chương
      

      chapterArray = ContentInEachSection[0].match(/^Chương.*$/igm);
      // data[a] = {[sectionArray[a]]:chapterArray}
      data[a] =[]
      data[a][sectionArray[a]] = []

    let ContentInEachChapter = []
    for(let b = 0 ; b<chapterArray.length;b++){
      if (b < chapterArray.length - 1) {
        let replace = `(?<=${chapterArray[b]}\n)(.*\n)*(?=${chapterArray[b + 1]})`;
        let re = new RegExp(replace, "gim");
        ContentInEachChapter = ContentInEachSection[0].match(re);
      } else {
        let replace = `((?<=${chapterArray[b]}))((\n.*)*)$`;
        let re = new RegExp(replace, "gim");
        ContentInEachChapter = ContentInEachSection[0].match(re);
      }

      articleArray = ContentInEachChapter[0].match(/^Điều \d+(.*)$/gim)

      if(!data[a][sectionArray[a]]){
      }
      data[a][sectionArray[a]][chapterArray[b]] = []

      for( let c = 0 ; c < articleArray.length;c++){
        if (c < articleArray.length - 1) {
          let replace = `(?<=${articleArray[c]}\n)(.*\n)*(?=${articleArray[c + 1]})`;
          let re = new RegExp(replace, "gim");
          point = ContentInEachChapter[0].match(re);
        } else {
          let replace = `((?<=${articleArray[c]}))((\n.*)*)$`;
          let re = new RegExp(replace, "gim");
          point = ContentInEachChapter[0].match(re);
        }
        if(!point){
          point=['']
          }

        // console.log('point',point);
        // console.log('articleArray',articleArray);
        // console.log(point);

        data[a][sectionArray[a]][chapterArray[b]].push({[articleArray[c]]:point[0]})

        
      }




    }



    


    }else{                                                // nếu mà trong 'phần thứ...' không có chương

      articleArray = ContentInEachSection[0].match(/^Điều \d+(.*)$/gim);
    

      // data[a] = {[sectionArray[a]]:articleArray}

      data[a] = []
      data[a][sectionArray[a]] = []
    for(let b = 0; b<articleArray.length;b++){

        if( b < articleArray.length-1 ){
            let replace = `(?<=${articleArray[b]}\n)(.*\n)*(?=${articleArray[b+1]})`;
            let re = new RegExp(replace, "gim");
            point = (ContentInEachSection[0].match(re));
          }else{
            let replace = `(?<=${articleArray[b]}\n)((.*\n.*)*).*`;
            let re = new RegExp(replace, "igm");
            point = ContentInEachSection[0].match(re);
          }
            
          if(!point){
          point=['']
          }

          data[a][sectionArray[a]][b] =[]
          data[a][sectionArray[a]][b].push({[articleArray[b]]: point[0]})
    }
  
  }




    //  let allChapter = ContentInEachSection[0].match(/^Chương(.*)$/gim);   // lấy từng chương trong mỗi section

    }



  }

  console.log('data',data);

    const db = getDatabase();
    const dbRef = ref(db);

    set(ref(db,`Law1/Luật xử lý VPHC`), 
    data
    );


  }

  function copy() {
    navigator.clipboard.writeText(document.querySelector(".output").value);
    alert("copied");
  }

  return (
    <div className="App">
      <textarea className="input" cols="90" rows="45"></textarea>
      <div className="btb_container">
        <div className="btb" onClick={() => covert()}>
          Covert
        </div>
        <div className="btb copy_btb" onClick={() => copy()}>
          Copy
        </div>
      </div>
      <textarea className="output" cols="90" rows="45"></textarea>
    </div>
  );
}

export default App;
