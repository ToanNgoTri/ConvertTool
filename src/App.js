import "./App.css";
import { Database, getDatabase, ref, child, get, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { app } from "./Firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getDatabase, ref, onValue  } from "firebase/database";


  // lâu lâu nếu các chữ VN như đ, ê, nếu viết nhanh thì không nhận dạng được. vd:điều,.. chú ý
  // dưới 3 phần tử trong luật sẽ bị lỗi vd dưới 3 chương, phần thứ n

  // chưa đưa tên nghị định thông tư và những "điều ..." có division SLASH (/) vô được 
  // (đưa được rồi nhưng thay bằng _ )
  // đôi khi khoảng cách các điều không đều

  
function App() {      
  function covert() {
    let input = document.querySelector(".input").value;

    let i0 = input.replace(/^Điều (\d+\w?)\.(.*)/igm, "Điều $1:$2")
    // điều . thành điều:

    let i0a =  i0.replace(/^Điều (\d+\w?)\.(.*)/igm, "Điều $1:$2")

    let i1 = i0a.replace(/^Điều (.*)\./gim, "Điều $1")
    // Bỏ . ở cuối hàng trong Điều

    let i2 = i1.replace(/^(\s)*(.*)/gm, "$2");
    // đề phòng có khoảng trống đầu hàng, cut it

    let i3 = i2.replace(/^\n/gm, "");
    // bỏ khoảng trống giữa các row

    // let i4;
    // if (!i3.match(/^Mục.*(:|\.).*\w*$/gmi)) {
    //   i4 = i3.replace(/^Mục (.*)\n(.*)/gim, "Mục $1: $2");
    //   // kết nối "mục với nội dung "mục", trường hợp bị tách 2 hàng
    // } else {
    //   i4 = i3;
    // }


    let i4;
      // i6 = i5.replace(/^Chương (.*)\n(.*)/gim, "Chương $1: $2");

      let i4a = []
      let initial = 4 // số dòng tối đa mặc định có thể bị xuống dòng làm cho phần 'chương' không được gộp 
                      // thành 1 dòng (có thể thay đổi để phù hợp tình hình)

      for(let b = 0;b<initial; b++ ){

        if (!b) {
          i4a[b] = i3.replace(/(?<=^Mục .*)\n(?!Điều \d.*)/gim, ": ");
        } else {
          i4a[b] = i4a[b-1].replace(/(?<=^Mục .*)\n(?!Điều \d.*)/gim, " ");

          // kết nối "mục với nội dung "mục", trường hợp bị tách 2 hàng
        }
          }

      i4= i4a[initial-1]



    let i5 = i4.replace(/^(Mục|Mục)(.*)\n/gim, "");
    // bỏ mục đi

    let i6 = i5.replace(/(\[|\()\d*(\]|\))/gim, "");
    // bỏ chỉ mục số đi

    let i7;
      // i6 = i5.replace(/^Chương (.*)\n(.*)/gim, "Chương $1: $2");

      let i7a = []

      for(let b = 0;b<initial; b++ ){
        if(!b){
          i7a[b] = i6.replace(/(?<=^Chương (V|I|X|\d).*)\n(?!Điều \d.*)/gmi, ": ");

        }else{
          i7a[b] = i7a[b-1].replace(/(?<=^Chương (V|I|X|\d).*)\n(?!Điều \d.*)/gmi, " ");
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
          i9a[c] = i8.replace(/(?<=^Phần thứ.*)\n(?!((điều \d.*)|(chương (V|I|X|\d).*$.*)))/gmi, ": ");
        }else{
          i9a[c] = i9a[c-1].replace(/(?<=^Phần thứ.*)\n(?!((điều \d.*)|(chương (V|I|X|\d).*$.*)))/gmi, " ");
        }
        
      }
      i9= i9a[initial-1]
      // i8 = i7.replace(/(?<=^Phần thứ.*)\n(?!điều.*)/gmi, ": ");

      let i10 =i9.replace(/\//gim, "\\")
      // loại dấu division spla sh bằng dấu _

      // let i10 =i9b.replace(/\n$/, ".")

    document.querySelector(".output").value = i10;


    let data =[];
if(!i10.match(/^phần thứ.*/gmi)){                                            // nếu không có phần thứ ...
    let chapterArray;   // lấy riêng lẻ từng chương thành 1 array
    if (i10.match(/^Chương (V|I|X|\d).*$/gim)) {
      chapterArray = i10.match(/^Chương (V|I|X|\d).*$/gim);
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
        articleArray = i10.match(re);
      } else {
        let replace = `((?<=${chapterArray[a]}))((\n.*)*)$`;
        let re = new RegExp(replace, "gim");
        articleArray = i10.match(re);
      }
// console.log(articleArray[0]);
      if (articleArray[0].match(/^(Điều|Điều) \d+(.*)$/gim)) {

        data[a] = {[chapterArray[a]]:[]}
        allArticle.push(articleArray[0].match(/^(Điều|Điều) \d+(.*)$/gim));
      } 
      else{
        // everyArticle = null
      }

      let countArticle = allArticle[a].length;
      // console.log(data[chapterArray[a]]);

      for(let b=0;b<countArticle;b++){

        // lỡ mà trong 'Điều ...' có dấu ngoặc ),( thì phải thêm \),\(
        // nếu không vì khi lấy nội dung của khoản sẽ bị lỗi 
        let TemRexgexArticleA =allArticle[a][b]
        
        if(allArticle[a][b].match(/\(/gim) ){      
          TemRexgexArticleA = allArticle[a][b].replace( /\(/, '\\(' );
          TemRexgexArticleA = TemRexgexArticleA.replace( /\)/, '\\)' );
        }

        
        
        
        if( b < countArticle-1 ){

          let TemRexgexArticleB = allArticle[a][b+1]

          if(allArticle[a][b+1].match(/\(/gim)){      
            TemRexgexArticleB = allArticle[a][b+1].replace( /\(/, '\\(' );
            TemRexgexArticleB = TemRexgexArticleB.replace( /\)/, '\\)' );            
          }

            let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
            let re = new RegExp(replace, "gim");

            if(articleArray[0].match(re)){
              // console.log(articleArray[0].match(re)[0]).replace(/\n$/, "");

              let e = articleArray[0].match(re)[0]
                e =  articleArray[0].match(re)[0].replace(/\n$/, "")
                e =  e.replace(/^\n/, "")
  
              point.push(e);
            }else{
              point.push(['']);
            }

          }else{
            let TemRexgexArticleB = allArticle[a][b]

            if(allArticle[a][b].match(/\(/gim)){      
              TemRexgexArticleB = allArticle[a][b].replace( /\(/, '\\(' );
              TemRexgexArticleB = TemRexgexArticleB.replace( /\)/, '\\)' );            
            }
  
            let replace = `(?<=${TemRexgexArticleB}\n)((.*\n.*)*).*`;
            let re = new RegExp(replace, "im");

            if(articleArray[0].match(re)){
            let e = articleArray[0].match(re)[0]
              e =  articleArray[0].match(re)[0].replace(/\n$/, "")
              e =  e.replace(/^\n/, "")

              point.push(e);

            }else{
              point.push(['']);
            }
            

          }
            
            for(let c = 0 ; c < 1;c++){
              d++;
              
              data[a][chapterArray[a]][b] = {[allArticle[a][b]]:point[d]}

              
            }
        }
    }

  }else{//////////////////////////////////////////////////////////////////////////////////////////////  // nếu có phần thứ ...

    let sectionArray;

    
    if (i10.match(/^phần thứ.*$/gmi)) {
      sectionArray = i10.match(/^phần thứ.*$/gmi);

      // console.log(sectionArray);
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
        ContentInEachSection = i10.match(re);
      } else {
        let replace = `((?<=${sectionArray[a]}))((\n.*)*)$`;
        let re = new RegExp(replace, "gim");
        ContentInEachSection = i10.match(re);
      }

      let chapterArray = []   // mảng có từng chapter riêng lẻ
      let articleArray =[]    // mảng có từng Điều riêng lẻ

      // console.log(ContentInEachSection[0].match(/^Chương.*$/igm));
      // console.log('ContentInEachSection',ContentInEachSection[0]);

      if(ContentInEachSection[0].match(/^Chương.*$/igm)){   // nếu mà trong 'phần thứ...' có chương
      

      chapterArray = ContentInEachSection[0].match(/^Chương.*$/igm);
      // console.log(chapterArray);
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
      articleArray = ContentInEachChapter[0].match(/^(Điều|Điều) \d+(.*)$/gim)
      data[a][sectionArray[a]][b] = []
      data[a][sectionArray[a]][b][chapterArray[b]] = []

      
      for( let c = 0 ; c < articleArray.length;c++){

        // lỡ mà trong 'Điều ...' có dấu ngoặc ),( thì phải thêm \),\(
        // nếu không vì khi lấy nội dung của khoản sẽ bị lỗi 
        let TemRexgexArticleA =articleArray[c]
        if(articleArray[c].match(/\(/gim) ){      
          TemRexgexArticleA = articleArray[c].replace( /\(/, '\\(' );
          TemRexgexArticleA = TemRexgexArticleA.replace( /\)/, '\\)' );
          
        }

        if (c < articleArray.length - 1) {                            

          let TemRexgexArticleB =articleArray[c + 1]


          if(articleArray[c + 1].match(/\(/gim) ){      // mới thêm sau này xem có chạy được không
            TemRexgexArticleB = articleArray[c + 1].replace( /\(/, '\\(' );
            TemRexgexArticleB = TemRexgexArticleB.replace( /\)/, '\\)' ); 
          }
  
          let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
          let re = new RegExp(replace, "gim");
          point = ContentInEachChapter[0].match(re);
        } else {

          let TemRexgexArticleB =articleArray[c]


          if(articleArray[c].match(/\(/gim) ){      // mới thêm sau này xem có chạy được không
            TemRexgexArticleB = articleArray[c].replace( /\(/, '\\(' );
            TemRexgexArticleB = TemRexgexArticleB.replace( /\)/, '\\)' ); 
          }
  

          let replace = `((?<=${TemRexgexArticleB}))((\n.*)*)$`;
          let re = new RegExp(replace, "gim");
          point = ContentInEachChapter[0].match(re);
        }
        let e
        if(point){
          e =  point[0].replace(/\n$/, "")
          e =  e.replace(/^\n/, "")

        }else{
            e = ''

          }

          
        data[a][sectionArray[a]][b][chapterArray[b]].push({[articleArray[c]]:e})

        
      }




    }



    


    }else{                                                // nếu mà trong 'phần thứ...' không có chương

      articleArray = ContentInEachSection[0].match(/^(Điều|Điều) \d+(.*)$/gim);
    

      // data[a] = {[sectionArray[a]]:articleArray}

      data[a] = []
      data[a][sectionArray[a]] = []
    for(let b = 0; b<articleArray.length;b++){

        // lỡ mà trong 'Điều ...' có dấu ngoặc ),( thì phải thêm \),\(
        // nếu không vì khi lấy nội dung của khoản sẽ bị lỗi 

        let TemRexgexArticleA = articleArray[b]
        if(articleArray[b].match(/\(/gim)){      
          TemRexgexArticleA = articleArray[b].replace( /\(/, '\\(' );
          TemRexgexArticleA = TemRexgexArticleA.replace( /\)/, '\\)' );
        }

        if( b < articleArray.length-1 ){

          let TemRexgexArticleB = articleArray[b+1]
          if(articleArray[b+1].match(/\(/gim)){      
            TemRexgexArticleB = articleArray[b+1].replace( /\(/, '\\(' );
            TemRexgexArticleB = TemRexgexArticleB.replace( /\)/, '\\)' );
          }  

            let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
            let re = new RegExp(replace, "gim");
            point = (ContentInEachSection[0].match(re));


          }else{

            let TemRexgexArticleB = articleArray[b]
            if(articleArray[b].match(/\(/gim)){      
              TemRexgexArticleB = articleArray[b].replace( /\(/, '\\(' );
              TemRexgexArticleB = TemRexgexArticleB.replace( /\)/, '\\)' );
            }  

            
            let replace = `(?<=${TemRexgexArticleB}\n)((.*\n.*)*).*`;
            let re = new RegExp(replace, "igm");
            point = ContentInEachSection[0].match(re);


          }
            
          let e

          if(point){
            e =  point[0].replace(/\n$/, "")
            e =  e.replace(/^\n/, "")
  
          }else{
            e =''

          }

          data[a][sectionArray[a]][b] =[]

          data[a][sectionArray[a]][b] = {[articleArray[b]]: e}

    }
  
  }




    //  let allChapter = ContentInEachSection[0].match(/^Chương(.*)$/gim);   // lấy từng chương trong mỗi section

    }



  }

  console.log('data',data);

    const db = getDatabase();
    const dbRef = ref(db);

    // set(ref(db,`Law1/Nghị định số 137\\2020\\NĐ-CP`), 
    // set(ref(db,`Law1/Thông tư số 32\\2023\\TT-BCA`), 

    set(ref(db,`Law1/Luật Cư trú năm 2020`), 
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
