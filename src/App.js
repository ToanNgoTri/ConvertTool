import "./App.css";
import { Database, getDatabase, ref, child, get, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { app } from "./Firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getDatabase, ref, onValue  } from "firebase/database";

// bỏ phần thứ nhất, thứ hai đi
function App() {
  function covert() {
    let input = document.querySelector(".input").value;

    let i0 = input.replace(/^Điều (\d+)\./gm, "Điều $1:")
    // điều . thành điều:

    let i1 = i0.replace(/^(\s)*(.*)/gm, "$2");
    // đề phòng có khoảng trống đầu hàng, cut it

    let i2 = i1.replace(/^\n/gm, "");
    // bỏ khoảng trống giữa các row

    let i3;
    if (!i2.match(/^Chương.*:.(\w)/gm)) {
      i3 = i2.replace(/^Chương (.*)\n(.*)/gim, "Chương $1: $2");
      // kết nối "chương với nội dung "chương", trường hợp bị tách 2 hàng
    } else {
      i3 = i2;
    }

    let i4 = i3.replace(/^mục(.*)\n/gim, "");
    // bỏ mục đi

    let i5;
    if (!i4.match(/^Phần thứ.*:.(\w)/gm)) {
      i5 = i4.replace(/^Phần thứ (.*)\n(.*)/gm, "Phần thứ $1: $2");
      // kết nối "chương với nội dung "phần thứ ...", trường hợp bị tách 2 hàng
    } else {
      i5 = i4;
    }

    let i6 = i5.replace(/^phần thứ(.*)\n/gim, "");
    // bỏ phần thức nhất, thứ hai

    document.querySelector(".output").value = i6;

    // const db = getDatabase();
    // const dbRef = ref(db);

    // set(ref(db,`Law1/chương 2: cụ thể`), {
    //   'Điều 1:  mua bán trái phép':[
    //     'khoản 1 dưới 1 gram','khoản 2 trên 1g'
    //   ],
    // });

    // get(child(dbRef, `Law1`)).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     let objs = (snapshot.val());
    //     // objs.map(obj => console.log(obj));
    //     Object.keys(objs).forEach(obj => {
    //       // console.log(objs[obj]);
    //     });
    //     // console.log(Object.keys(objs));
    //   } else {
    //     console.log("No data available");
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // });

    let chapterArray;
    if (i6.match(/^Chương.*$/gm)) {
      chapterArray = i6.match(/^Chương.*$/gm);
      // console.log(chapterArray);
    } else {
      chapterArray = null;
    }
    let articleArray ;  // lấy khoảng giữa các khoảng
    // let data = {}
    // let data = []
    let data = i6.match(/^Chương.*$/gm);
    let allArticle = [];  // lấy riêng lẻ các điều
    let point = []
    let d=-1
    for (var a = 0; a < chapterArray.length; a++) {
      // data[chapterArray[a]] = {};
      articleArray = [];
      // let everyArticle = [];
      if (a < chapterArray.length - 1) {
        let replace = `(?<=${chapterArray[a]}\n)(.*\n)*(?=${chapterArray[a + 1]})`;
        let re = new RegExp(replace, "gm");
        articleArray = i6.match(re);
      } else {
        let replace = `((?<=${chapterArray[a]}))((\n.*)*)$`;
        let re = new RegExp(replace, "gm");
        articleArray = i6.match(re);
      }

      // articleArray[0].match(/^Điều(.*)\n(\D.*)$/gm
      if (articleArray[0].match(/^Điều \d+(.*)$/gm)) {
        // everyArticle.push(articleArray[0].match(/^Điều(.*)(\n\D.*)*(?=\n\d.*)/gm));
        // ^Điều(.*)(\n\D.*)*(?=\n\d.*)
        // console.log(articleArray[0].match(/\nĐiều(.*)$/gm));
        // console.log(chapterArray);


        // everyArticle.push(articleArray[0].match(/^Điều \d+(.*)$/gm));

        // data[chapterArray[a]] = articleArray[0].match(/^Điều \d+(.*)$/gm)
        data[a] = {[chapterArray[a]]:articleArray[0].match(/^Điều \d+(.*)$/gm)}
        allArticle.push(articleArray[0].match(/^Điều \d+(.*)$/gm));
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
            let re = new RegExp(replace, "gm");
            point.push(articleArray[0].match(re));
            // sửa lại
          }else{
            let replace = `(?<=${allArticle[a][b]}\n)((.*\n.*)*).*`;
            let re = new RegExp(replace, "gm");
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
    console.log('data',data);
    // console.log('allArticle',allArticle);

    const db = getDatabase();
    const dbRef = ref(db);

    set(ref(db,`Law1/Luật Cạnh Tranh 2018`), 
    data
    );


    // console.log("allArticle", allArticle);

    // let replace = `${chapterArray[0]}((\n.*\n.*)*)\n${chapterArray[1]}`;
    // let re = new RegExp(replace,"gm");
    // let i5 = i4.match(re);
    
    // let replace1 = `${chapterArray[0]}`;
    // let re1 = new RegExp(replace1,"gm");
    // let i6 = i5[0].replace(re1,'');

    // let replace2 = `${chapterArray[1]}`;
    // let re2 = new RegExp(replace2,"gm");
    // let i7 = i6.replace(re2,'');

    // // let i4 = i3.match(re)
    // console.log(i7);

    // get(child(dbRef, `Law1`)).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     let objs = (snapshot.val());
    //     // objs.map(obj => console.log(obj));
    //     Object.keys(objs).forEach(obj => {
    //       console.log(objs[obj]);
    //     });
    //     // console.log(Object.keys(objs));
    //   } else {
    //     console.log("No data available");
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // });

    // let input = document.querySelector('.input').value ;
    // let i1 = input.replace(/^(\s)*(.*)/gm,'$2')
    // // đề phòng có khoảng trống đầu hàng, cut it

    // let i2 = i1.replace(/^\n/gm,'')
    // // bỏ khoảng trống giữa các row

    // let i3;
    // if(!i2.match(/^Chương.*:.(\w)/gm)){
    // i3 = i2.replace(/^Chương (.*)\n(.*)/gim,'Chương $1: $2');
    // // kết nối "chương với nội dung "chương", trường hợp bị tách 2 hàng
    // }else{
    //  i3 = i2
    // }

    //  let i4 = i3.replace(/^/gm,'<Text style={styles.lines}>{`');
    // //  thêm vào <Text style={styles.lines}>{` (^ ở đầu)

    //  let i5 = i4.replace(/$/gm,'`}</Text>');
    //  // $ ở cuối là `}</Text>

    //  let i6 =  i5.replaceAll('styles.lines}>{`Điều','styles.dieu}>{`Điều');
    //  // sửa cho "điều"

    //  let i7 =  i6.replaceAll('lines}>{`Chương','chapterText}>{`Chương');
    //  // sửa sửa cho 'chương"

    //  let i8 =  i7.replaceAll(/(.)$/g,'$1\n</View>');
    //  // sửa sửa cho 'chương"

    //  let countChapter
    //  if(i8.match(/chapterText}>{`Chương/gm)) {
    //   countChapter =  i8.match(/chapterText}>{`Chương/gm).length;
    //  }else{
    //   countChapter = 0
    //  }
    //  // đếm chương

    //   let b = [];
    //   b[1] = i8
    //   for(let i=1;i<=countChapter; i++){

    //   if(i !== 1){
    //   b[i+1] =  b[i].replace(/^<Text style={styles.chapterText}>(.*)<\/Text>$/im,`</View>\n<TouchableOpacity style={styles.chapter} onPress={() => {setTittle${i}(!tittle${i});}}><Text style={styles.chapterText}>$1</Text></TouchableOpacity>\n<View style={tittle${i} && styles.content${i}}>`)
    //   }else{
    //     b[i+1] =  b[i].replace(/^<Text style={styles.chapterText}>(.*)<\/Text>$/im,`<TouchableOpacity style={styles.chapter} onPress={() => {setTittle${i}(!tittle${i});}}><Text style={styles.chapterText}>$1</Text></TouchableOpacity>\n<View style={tittle${i} && styles.content${i}}>`)
    //   }
    // }

    // document.querySelector('.output').value = b[countChapter+1]
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
