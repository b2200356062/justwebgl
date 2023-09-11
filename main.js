try {
    hellotriangle();
}catch (e){
    alert("sorun cıktı!?");
}

function hellotriangle(){
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl){
        console.log("webgl not supported");
    }

    // vertexleri oluştur
    const trianglevertices = [
        // top middle
        0.0, 0.5,
        // bottom left
        -0.5, -0.5,
        // bottom right
        0.5, -0.5
    ];

    // cpu bufferı olustur (float32 array) sonra gpu bufferı olustur. sonra bufferı bindla ve datasını gir(data source = cpu buffer olcak)
    const triangleverticescpubuffer = new Float32Array(trianglevertices); // cpu visible, javascriptdeki sayılar arka arkaya (array) olmayabiliyor
    const trianglegeobuffer = gl.createBuffer(); // buffer on the gpu, needs attachment
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglegeobuffer); // attached to array buffer
    gl.bufferData(gl.ARRAY_BUFFER, triangleverticescpubuffer, gl.STATIC_DRAW); // cpudaki bufferı gpuya göndermek


    // vertex shader sourceu gir
    // vec2 means 2 number
    const vertexshadersource=
        `#version 300 es
        precision mediump float;
        
        in vec2 vertexposition; 
        
        void main(){
            gl_Position = vec4(vertexposition, 0.0, 1.0);
        }`;

    // vertex shaderı olustur, sourceunu belirle ve compilela
    const vertexshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexshader, vertexshadersource);
    gl.compileShader(vertexshader);
    if (!gl.getShaderParameter(vertexshader, gl.COMPILE_STATUS)){
        alert("shader zortladı loga bak!");
        const compileerror = gl.getShaderInfoLog(vertexshader);
        console.log(compileerror);
        return;
    }

    // fragment shaderı olustur, sourceu belirle ve compilela
    const fragmentshadersource=
        `#version 300 es
        precision mediump float;
        out vec4 outputcolor;
        void main(){
            outputcolor = vec4(0.294, 0.0, 0.51, 1.0);
        }`;

    const fragmentshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentshader, fragmentshadersource);
    gl.compileShader(fragmentshader);
    if(!gl.getShaderParameter(fragmentshader, gl.COMPILE_STATUS)){
        alert("fragment shader zortladı loga bak");
        const compileeror2 = gl.getShaderInfoLog(fragmentshader);
        console.log(compileeror2);
        return;
    }

    // programı olustur
    const triangleprogram = gl.createProgram();

    //programa shaderları attachla
    gl.attachShader(triangleprogram, vertexshader);
    gl.attachShader(triangleprogram, fragmentshader);

    //programı linkle
    gl.linkProgram(triangleprogram);

    //attribute location belirle
    const vertexpositionattributelocation = gl.getAttribLocation(triangleprogram, 'vertexposition');

    if(vertexpositionattributelocation < 0){
        console.log("vertexposition 0dan kücük")
        return;
    }

    // output merger - how to merge the shaded pixel fragment with the existing output image
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.08,0.08,0.08,1);
    gl.clear(gl.COLOR_BUFFER_BIT |gl.DEPTH_BUFFER_BIT);

    // rasterizer - which pixels are part of a triangle
    gl.viewport(0,0, canvas.width, canvas.height);

    //setup the gpu program
    gl.useProgram(triangleprogram);
    gl.enableVertexAttribArray(vertexpositionattributelocation);

    // input assembler - how to read vertices from our gpu triangle buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglegeobuffer);
    gl.vertexAttribPointer(
        // which attribute to use
        vertexpositionattributelocation,
        // size: how many components in that attribute (position, color?)
        2,
        // type of the data in the gpu buffer data
        gl.FLOAT,
        // is it normalized?
        false,
        //stride - how many bytes to move forward in the buffer to find the same attribute for the next vertex
        0,
        //offset - how many bytes should the input assembler skip into the buffer when reading attributes
        0)

    //draw call
    gl.drawArrays(gl.TRIANGLES, 0, 3);






}