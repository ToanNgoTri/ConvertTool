import "./App.css";
import { Database, getDatabase, ref, child, get, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { app } from "./Firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getDatabase, ref, onValue  } from "firebase/database";

function App() {
  function covert() {
    let input = document.querySelector(".input").value;
    let i1 = input.replace(/^(\s)*(.*)/gm, "$2");
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

    document.querySelector(".output").value = i4;

    // const db = getDatabase();
    // const dbRef = ref(db);

    // // set(ref(db,`Law1/chương 2: cụ thể`), {
    // //   'Điều 1:  mua bán trái phép':{
    // //     'khoản 1': 'dưới 1 gram'
    // //   },
    // // });

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
    if (i4.match(/^Chương.*$/gm)) {
      chapterArray = i4.match(/^Chương.*$/gm);
      // console.log(chapterArray);
    } else {
      chapterArray = null;
    }
    let allArticleArray = [];
    let articleArray;

    for (var a = 0; a < chapterArray.length; a++) {
      let articleArray = [];
      let everyArticle = [];
      if (a < chapterArray.length - 1) {
        let replace = `((?<=${chapterArray[a]}))((\n.*)*)\n((?=${
          chapterArray[a + 1]
        }))`;
        let re = new RegExp(replace, "gm");
        articleArray = i4.match(re);
        allArticleArray.push(articleArray[0]);
      } else {
        let replace = `((?<=${chapterArray[a]}))((\n.*)*)$`;
        let re = new RegExp(replace, "gm");
        articleArray = i4.match(re);
        allArticleArray.push(articleArray[0]);
      }
      // articleArray[0].match(/^Điều(.*)\n(\D.*)$/gm
      if (articleArray[0].match(/\nĐiều(.*)$/gm)) {
        let c = `\nĐiều(.*)\n(\D.*)$`;
        let d = new RegExp(c, "gm");
        everyArticle.push(articleArray[0].match(d));

        // console.log(chapterArray);
      } else {
        // everyArticle = null
      }

      // if (temMatch.match(/^Điều.*$/gm) ){
      //   chapterArray = i4.match(/^Điều.*$/gm);
      //   // console.log(chapterArray);
      // }else{
      //   chapterArray = 0
      // }

      console.log("all Article", everyArticle);

      // console.log(a);
      // articleArray = i4.match(/^Điều.*/gm);

      // for(let b=0;b<=a;b++){
      //   console.log(articleArray.length);
      // }
    }
    // let i4 = i3.match(re)
    console.log("all chapter", chapterArray);

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

  async function fetchData()
  {
    try
    {
      let url = "https://thuvienphapluat.vn/van-ban/Lao-dong-Tien-luong/Thong-bao-1570-TB-BLDTBXH-2024-de-xuat-hoan-doi-ngay-lam-viec-dip-nghi-le-ngay-30-4-606184.aspx";
      let url2 = "https://google.com.vn";
      let res = await fetch(url2, {mode:'no-cors'}); // {mode:'no-cors'}
      let text = await res.json();
      document.querySelector(".input").value = text;
    }
    catch (error)
    {
      console.log(error);
    }
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
        <div className="btb fetch_data" onClick={() => fetchData()}>
          Copy
        </div>
      </div>
      <textarea className="output" cols="90" rows="45"></textarea>
    </div>
  );
}

export default App;
