//Min Heap Implementation
class MinHeap{
    //Constructor
    constructor(){
        this.heap_array=[];
    }

    //Return size of heap
    size(){
        return this.heap_array.length;
    }

    //Return if heap is empty
    empty(){
        return (this.size()===0);
    }

    //Pushing new value into heap
    push(value){
        this.heap_array.push(value);
        this.up_heapify();
    }

    //Return smallest element
    top(){
        return this.heap_array[0];
    }

    //Removing Smallest element
    pop(){
        if(this.empty()==false){
            var last_index=this.size()-1;
            this.heap_array[0]={...this.heap_array[last_index]};
            this.heap_array.pop();
            this.down_heapify();
        }
    }

    //Down heapify(Use for deleting and making heap)
    down_heapify(){
        var current_index=0;
        while(current_index<this.size()){
            var current_element=this.heap_array[current_index];
            var child_index1=(current_index*2)+1;
            var child_index2=(current_index*2)+2;
            var child_element1=null;
            var child_element2=null;
            var smallest=current_index;
            if(child_index1<this.size() && this.heap_array[child_index1][0]<this.heap_array[smallest][0]){
                smallest=child_index1;
                child_element1=this.heap_array[child_index1];
            }
            if(child_index2<this.size() && this.heap_array[child_index2][0]<this.heap_array[smallest][0]){
                smallest=child_index2;
                child_element2=this.heap_array[child_index2];
            }
            if(smallest==child_index1){
                this.heap_array[child_index1]=current_element;
                this.heap_array[current_index]=child_element1;
                current_index=child_index1;
            }
            else if(smallest==child_index2){
                this.heap_array[child_index2]=current_element;
                this.heap_array[current_index]=child_element2;
                current_index=child_index2;
            }
            else break;
        }
    }
    
     //Up heapify(Use for inserting element)
     up_heapify(){
        var current_index=this.size()-1;
        while(current_index>0){
            var current_element=this.heap_array[current_index];
            var parent_index=Math.trunc((current_index-1)/2);
            var parent_element=this.heap_array[parent_index];

            if(parent_element[0]<current_element[0]){
                break;
            }
            
            else{
                this.heap_array[parent_index]=current_element;
                this.heap_array[current_index]=parent_element;
                current_index=parent_index;
            }
        }
    }
}


//Coder Decoder Class
class Codec{
    
    // Converting Huffman tree into a string
    make_string(node){
        if(typeof(node[1])==="string"){
            return "'"+node[1];
        }
        return '0'+this.make_string(node[1][0])+'1'+this.make_string(node[1][1]);
    }

    // Converting Huffman string into a tree
    make_tree(tree_string){
        let node=[];
        if (tree_string[this.index] === "'") {
			this.index++;
			node.push(tree_string[this.index]);
			this.index++;
			return node;
		}
        this.index++;
        node.push(this.make_tree(tree_string));//Pushing left child
        this.index++;
        node.push(this.make_tree(tree_string));//Pushing Right child
        return node;
    }
    
    //DFS based code conversion
    getCodes(node, curr_code){
        //Leaf node found
        if(typeof(node[1])==="string"){
            this.codes[node[1]]=curr_code;
            return;
        }
        //Else explore left and right
        this.getCodes(node[1][0], curr_code+'0');//Go Left
        this.getCodes(node[1][1], curr_code+'1');//Go Right
    }
    
    encode(data){
        this.heap=new MinHeap();
        var mp=new Map();

        //Setting frequency of each character
        for(let i=0;i<data.length;i++){
            if(mp.has(data[i])){
                let foo=mp.get(data[i]);
                mp.set(data[i], foo+1);
            }
            else{
                mp.set(data[i],1);
            }
        }


        //If input file is empty
        if(mp.size===0){
            let final_string="zero#";
            let output_message = "Compression complete and file sent for download. " + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
            return [final_string, output_message];
        }

        //If input file has only one character
        if(mp.size===1){
            let key, value;
            for(let [k,v] of mp){
                key=k;
                value=v;
            }
            let final_string="one"+'#'+key+'#'+value.toString();
            let output_message = "Compression complete and file sent for download. " + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
            return [final_string, output_message];
        }

        //Now, if input text has more than one characters
        
        //Pushing all in heap
        for(let[key, value] of mp){
            this.heap.push([value, key]);
        }

        //Making huffman tree
        while(this.heap.size()>=2){
            let temp_node1=this.heap.top();
            this.heap.pop();
            let temp_node2=this.heap.top();
            this.heap.pop();
            let newNode=[(temp_node1[0]+temp_node2[0]), [temp_node1, temp_node2]];
            this.heap.push(newNode);
        }
        var huffman_tree=this.heap.top();
        this.heap.pop();
        this.codes={};
        this.getCodes(huffman_tree, "");

        //Making Codes
        let binary_string="";
        for(let i=0;i<data.length;i++){
            binary_string+=this.codes[data[i]];
        }

        //To make string length divisible by 8
        let padding_length=(8-(binary_string.length%8))%8;
        for(let i=0;i<padding_length;i++){
            binary_string+='0';
        }
        
        //Converting each 8 bits to corresponding character
        let encoded_data="";
        for(let i=0;i<binary_string.length;){
            let curr_num=0;
            for(let j=0;j<8;j++,i++){
                curr_num*=2;
                curr_num+=(binary_string[i]-'0');
            }
            encoded_data+=String.fromCharCode(curr_num);
        }

        //tree_string contains representation of tree in string manner
        let tree_string=this.make_string(huffman_tree);
        let ts_length=tree_string.length;

        //Final Compressed String contains:-
        //1.tree_string length
        //2.Padding length
        //3.tree_string
        //4.encoded_string
        let final_string=ts_length.toString()+'#'+padding_length.toString()+'#'+tree_string+encoded_data;
        let output_message="Compression complete and file sent for download. " + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
        return [final_string, output_message];
    }

    //Decoding data
    decode(data){
        let k=0;
        let temp="";
        while(k<data.length && data[k]!='#'){
            temp+=data[k];
            k++;
        }

        //No '#' in file(Not a encoded file)
        if(k==data.length){
            alert("Invalid File!\nPlease submit a valid compressed .txt file to decompress and try again!");
			location.reload();
			return;
        }

        //Empty file
        if(temp==="zero"){
            let decoded_data="";
            let output_message="Decompression complete and file sent for download.";
            return [decoded_data, output_message];
        }

        //One character file
        if(temp==="one"){
            
            //Extracting than one character
            data=data.slice(k+1);
            k=0;
            temp="";
            while(data[k]!="#"){
                temp+=data[k];
                k++;
            }
            let one_char=temp;
            
            //Extracting count of that character
            data=data.slice(k+1);
            let str_len=parseInt(data);
            
            //Making data
            let decoded_data="";
            for(let i=0;i<str_len;i++){
                decoded_data+=one_char;
            }
            let output_message= "Decompression complete and file sent for download.";
			return [decoded_data, output_message];
        }
        
        //Now, for multi-character file
        
        //Getting tree String Length
        let ts_length=parseInt(temp);
        
        //Getting Padding Length
        data=data.slice(k+1);
        k=0;
        temp="";
        while(data[k]!='#'){
            temp+=data[k];
            k++;
        }
        let padding_length=parseInt(temp);
        
        //Getting Tree string
        data = data.slice(k + 1);
        temp="";
        for(k=0;k<ts_length;k++){
            temp+=data[k];
        }
        let tree_string=temp;
        
        // Getting encoded data
        data=data.slice(k);
        temp = "";
		for (k = 0; k < data.length; k++) {
            temp += data[k];
		}
		let encoded_data = temp;

        //Making huffman tree from string
        this.index=0;
        var huffman_tree = this.make_tree(tree_string);

        //Retrieving binary_string from encoded_data
        let binary_string="";
        for(let i=0;i<encoded_data.length;i++){
            let curr_num=encoded_data.charCodeAt(i);
            let curr_binary="";
            for (let j = 7; j >= 0; j--) {
				let foo = curr_num >> j;
				curr_binary = curr_binary + (foo & 1);
			}
            binary_string+=curr_binary;
        }
        
        //Remove Padding
        binary_string=binary_string.slice(0, binary_string.length-padding_length);

        //Final decoding using binary_string and huffman_tree
        let decoded_data="";
        let node=huffman_tree;
        for(let i=0;i<binary_string.length;i++){
            if(binary_string[i]==='0'){
                node=node[0];
            }
            else{
                node=node[1];
            }
            if(typeof(node[0])==="string"){
                decoded_data+=node[0];
                node=huffman_tree;
            }
        }
        let output_message = "Decompression complete and file sent for download.";
		return [decoded_data, output_message];
    }
}


//Onloading tasks
window.onload=function(){

    //Accessing DOM elements
    decodeBtn=document.getElementById("decode");
    encodeBtn=document.getElementById("encode");
    fileForm=document.getElementById("fileForm");
    uploadFile=document.getElementById("uploadFile");
    submitBtn=document.getElementById("submitBtn");
    step1=document.getElementById("step1");
    step2=document.getElementById("step2");
    step3=document.getElementById("step3");
    
    isSubmitted=false;
    codecObj=new Codec();

    //Called when submit button is clicked
    submitBtn.onclick=function(e){
        e.preventDefault();
        var uploadedFile=uploadFile.files[0];
        
        //Checking if file is uploaded
        if(uploadedFile===undefined){
            alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
            return;
        }

        //Checking of extension is correct
        let nameSplit=uploadedFile.name.split('.');
        let extension=nameSplit[nameSplit.length-1].toLowerCase();
        if(extension!="txt"){
            alert("Invalid file type (."+extension+".)\nPlease upload a valid .txt file and try again");
            return;
        }

        isSubmitted=true;
        onClickChanges("Done!! File Uploaded!", step1);
    }

    //Called when compress button is clicked
    encodeBtn.onclick=function(){

        //Checking if file is uploaded
        var uploadedFile=uploadFile.files[0];
        if(uploadedFile===undefined){
            alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
            return;
        }
        if(isSubmitted===false){
            alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
            return;
        }
        
        //Giving warning on smaller sizes
        if(uploadedFile.size === 0){
			alert("WARNING: You have uploaded an empty file!\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!");
		}	
		else if(uploadedFile.size < 1000){
			alert("WARNING: The uploaded file is small in size (" + uploadedFile.size +" bytes) !\nThe compressed file's size might be larger than expected (compression ratio might be small).\nBetter compression ratios are achieved for larger file sizes!");
		}

        //Making changings in boxes
        onClickChanges("Done!! Your file will be Compressed", step2);
        onClickChanges2("Compressing Your File....", "Compressed");

        //Reading the files and sending it for encoding and then, to download
        let reader = new FileReader();
        reader.onload = function() {
            let text=reader.result;
            let [encodedString, outputMsg]=codecObj.encode(text);
            myDownloadFile(uploadedFile.name.split('.')[0]+"_compressed.txt", encodedString);
            onDownloadChanges(outputMsg);
        };
        reader.readAsText(uploadedFile, "UTF-8");
    }

    //Called when decompress button is clicked
    decodeBtn.onclick=function(){
        var uploadedFile=uploadFile.files[0];

        //If file is not uploaded
        if(uploadedFile===undefined){
            alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
            return;
        }
        if(isSubmitted===false){
            alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
            return;
        }

        //Making Changes
        onClickChanges("Done!! Your file will be De-Compressed", step2);
        onClickChanges2("De-Compressing Your File....", "De-compressed");

        //Rading the file and sending it for decode and then, to download
        let reader = new FileReader();
        reader.onload = function() {
            let text=reader.result;
            let [decodedString, outputMsg]=codecObj.decode(text);
            myDownloadFile(uploadedFile.name.split('.')[0]+"_decompressed.txt", decodedString);
            onDownloadChanges(outputMsg);
        };
        reader.readAsText(uploadedFile, "UTF-8");
    }
}

//Function for changes in boxes after completion of steps
function onClickChanges(msg, step){
    step.innerHTML="";
    let img=document.createElement("img");
    img.src="img/done.png";
    step.appendChild(img);
	let msg1 = document.createElement("span");
	msg1.className = "text2";
	msg1.innerHTML = msg;
	step.appendChild(msg1);
}

function onClickChanges2(msg, word){
    decodeBtn.disabled=true;
    encodeBtn.disabled=true;
    step3.innerHTML="";
    let msg2 = document.createElement("span");
	msg2.className = "text2";
	msg2.innerHTML = msg;
	step3.appendChild(msg2);
    let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = " , " + word + " file will be downloaded automatically!";
	step3.appendChild(msg3);
}

//Automatically Downloading file
function myDownloadFile(fileName, text) {
	let a = document.createElement('a');
	a.href = "data:application/octet-stream," + encodeURIComponent(text);
	a.download = fileName;
	a.click();
}

//Changing DOM after Download
function onDownloadChanges(outputMsg) {
	step3.innerHTML = "";
	let img = document.createElement("img");
	img.src = "img/done.png";
	img.id = "doneImg";
	step3.appendChild(img);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = outputMsg;
	step3.appendChild(msg3);
}