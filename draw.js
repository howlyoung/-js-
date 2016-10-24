    var boxConfig = {'sides':10,'offsetX':3,'offsetY':0};
    var colorArr = ['#FF4500','#EEC900','#EE00EE','#CAFF70','#9A32CD','#8B0000'];

    function Draw() {
        this.startX = 100;      //��׼����px  X
        this.startY = 0;        //��׼����px  Y
    }

    //���Ʒ���
    Draw.prototype.block = function (pointArr,poisition,sides,color) {
        if(!Array.isArray(pointArr)) {
            return false;
        }
        var length = pointArr.length;
        var blockDiv = document.createElement("div");
        var x,y;
        for(var i=0;i<length;i++) {
            x = poisition.x + pointArr[i][0]+1;
            y = poisition.y + pointArr[i][1]+1;
            blockDiv.appendChild(this.drawing(x,y,sides,color));
        }
        return blockDiv;
    };

    Draw.prototype.drawing = function(x,y,sides,color) {
        var div = document.createElement("div");
        div.style.width=sides;
        div.style.height=sides;
        div.style.backgroundColor= color;
        div.style.position='absolute';
        div.style.left = this.startX +  x * sides;
        div.style.top = this.startY +  y * sides;
        return div;
    };

    //����
    Draw.prototype.erase = function(div) {
        var parent = div.parentElement;
        parent.removeChild(div);
    };

    function Box() {
        this.poisition = null;     //����λ��
        this.old_poisition = null; //�����ƶ�ǰλ��
        this.type = 0;               //��������
        this.sort = 0;                  //����˳��
        this.old_sort = 0;              //�������ǰ����
        this.color = 0;             //������ɫ
        this.box_type = this.getBoxType();
    };

    Box.prototype.init = function(poisition,type,color) {
        this.poisition = poisition;     //����λ��
        this.old_poisition = {'x':poisition.x,'y':poisition.y}; //�����ƶ�ǰλ��
        this.type = type;               //��������
        this.sort = 0;                  //����˳��
        this.old_sort = 0;              //�������ǰ����
        this.color = color;
    };

    Box.prototype.reset = function() {
        this.poisition = null;     //����λ��
        this.old_poisition.x = 0;   //�����ƶ�ǰλ��
        this.old_poisition.y = 0;   //�����ƶ�ǰλ��
        this.type = 0;               //��������
        this.sort = 0;                  //����˳��
        this.old_sort = 0;              //�������ǰ����
        this.color = 0;
    };

    Box.prototype.getRandomBox = function() {
        var all_box = this.box_type;
        var length = all_box.length;
        var random = parseInt(Math.random()*length);
        var colorLength = colorArr.length;
        var randomColor = parseInt(Math.random()*colorLength);

        this.init({'x': boxConfig.offsetX,'y': boxConfig.offsetY},all_box[random],colorArr[randomColor]);
    };

    Box.prototype.sides = boxConfig.sides;

    //doing
    Box.prototype.moveBox = function(direction) {
        var dir;
        //1 ����  2����  3����
        if(direction!=1 && direction!=2 && direction !=3) {
            dir = 1;
        } else {
            dir = direction;
        }
        this.old_poisition.x = this.poisition.x;
        this.old_poisition.y = this.poisition.y;
        switch (dir) {
            case 1:
                this.poisition.y++;
                break;
            case 2:
                this.poisition.x--;
                break;
            case 3:
                this.poisition.x++;
                break;
        }
    };

    //ȥ�����ţ�����ֻ���ַ�������δ���õ��������
    Box.prototype.all_box = {
        't':[t_box_1,t_box_2,t_box_3,t_box_4],
        'lr':[l_box_r_1,l_box_r_2,l_box_r_3,l_box_r_4],
        'll':[l_box_l_1,l_box_l_2,l_box_l_3,l_box_l_4],
        'strip':[vertical_box,horizontal_box],
        'rect':[rectangle_box],
        'lz':[z_box_l_1,z_box_l_2],
        'rz':[z_box_r_1,z_box_r_2]
    };

    Box.prototype.getBoxType = function() {
        var typeArr = [];
        for(var key in this.all_box) {
            typeArr.push(key);
        }
        return typeArr;
    };

    //���ط�������
    Box.prototype.getShape = function() {
        return this.all_box[this.type][this.sort];
    };

    Box.prototype.getColor = function() {
        return this.color;
    };

    //����λ��
    Box.prototype.getPos = function() {
      return this.poisition;
    };

    Box.prototype.getSides = function() {
        return this.sides;
    };

    //����
    Box.prototype.transformed = function() {
        var length = this.all_box[this.type].length - 1;
        this.old_sort = this.sort;    //��ű���֮ǰ����״
        if(this.sort < length) {
            this.sort++;
        } else {
            this.sort = 0;
        }
    };

    //���ص���
    Box.prototype.getPoint = function() {
        return this.all_box[this.type][this.sort];
    };

    //��ԭ����
    Box.prototype.rollbackPos = function() {
        this.poisition.x = this.old_poisition.x;
        this.poisition.y = this.old_poisition.y;
    };

    Box.prototype.rollbackShape = function() {
        this.sort = this.old_sort;
    };

    //��Ϸ����
    function Map(x,y,sides) {
        this.baseX = x;    //��׼λ��ƫ��
        this.baseY = y;    //��׼λ��ƫ��
        this.boxSides = sides;  //����ı߳�
        //1��ʾ�����
        this.area = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];

    }

    Map.prototype.reset = function() {
        var length = this.area.length;
        for(var i=0;i<length;i++) {
            for(var j=0;j<this.area[i].length;j++) {
                this.area[i][j] = 0;
            }
        }
    };

    //��ײ�������߽���
    Map.prototype.collision = function(poisition,pointArr) {
        if(!Array.isArray(pointArr)) {
            return false;
        }
        var length = pointArr.length;
        var tmpPosX,tmpPosY;
        var grid;console.log(poisition);
        for(var i=0;i<length;i++) {
            grid = this.getAreaGrid(poisition,pointArr[i]);

            tmpPosX =  (poisition.x + pointArr[i][0]);
            tmpPosY = (poisition.y + pointArr[i][1]);

            if(tmpPosX < 0 || tmpPosX > 9 || tmpPosY < 0 || tmpPosY > 19) {
                console.log('out');
                return false;
            } else if(1==this.area[grid.y][grid.x]) {
                //console.log('fail');
                return false;
            }
        }
        return true;
    };

    Map.prototype.getAreaGrid = function(poisition,point) {
        var x = poisition.x + point[0];
        var y = poisition.y + point[1] + 1;
        return {'x':x,'y':y};
    };

    //�ں�
    Map.prototype.fuse = function(poisition,pointArr) {
        if(!Array.isArray(pointArr)) {
            return false;
        }
        var length = pointArr.length;
        var grid;
        var gridArr = [];
        for(var i=0;i<length;i++) {
            grid = this.getAreaGrid(poisition,pointArr[i]);
            if(1==this.area[grid.y][grid.x]) {
                return false;
            }
            gridArr.push(grid);
        }
        for(var j=0;j<gridArr.length;j++) {
            this.area[gridArr[j].y][gridArr[j].x] = 1;
        }
        return true;
    };

    //����
    Map.prototype.remove = function() {
        var length = this.area.length;
        var fillNum = 0;    //����������
        for(var i=0;i<length;i++) {
            if(this.area[i].indexOf(0)<0) {
                //��������������ķ�������
                for(var j=(i-1),k=i;j>0;j--,k--) {
                    this.area[k] = this.area[j];
                }
                fillNum++;
            }
        }
        return fillNum;
    };

    //��Ϸ���󣬰�����Ϸ��ѭ�������̿��Ƶ�
    function Game(canvas,scoreDom) {
        this.box= new Box();  //�������
        this.canvas = canvas; //��������div����
        this.draw = new Draw(); //���ƹ��߶���
        this.map = new Map(10,0,this.box.getSides());  //��Ϸ�������
        this.speed = 0;     //��Ϸ�ٶ�
        this.drawDiv = null;    //���ƶ���
        this.score = 0; //����
        this.flag = true;   //��Ϸ״̬��false��ʾʧ��
        this.scoreDom = scoreDom;   //������dom
    };

    Game.prototype.scoreLevel = [0,1,2,5,8];

    Game.prototype.moveBox = function(direction) {
        this.box.moveBox(direction);
        if(this.map.collision(this.box.getPos(),this.box.getPoint())) {
            //this.draw.erase(this.drawDiv);
            //this.drawDiv = this.draw.block(this.box.getShape(),this.box.getPos(),this.box.getSides(),this.box.getColor());
            //this.canvas.appendChild(this.drawDiv);
            this.render(this.box.getColor());
            return true;
        } else {
            this.box.rollbackPos();
            return false;
        }
    };

    Game.prototype.tranBox = function() {
        this.box.transformed();
        if(this.map.collision(this.box.getPos(),this.box.getPoint())) {
            //this.draw.erase(this.drawDiv);
            //this.drawDiv = this.draw.block(this.box.getShape(),this.box.getPos(),this.box.getSides(),this.box.getColor());
            //this.canvas.appendChild(this.drawDiv);
            this.render(this.box.getColor());
            return true;
        } else {
            this.box.rollbackShape();
            return false;
        }
    };

    Game.prototype.fuse = function() {
        if(this.map.fuse(this.box.getPos(),this.box.getPoint())) {
            //this.draw.erase(this.drawDiv);
            //this.drawDiv = this.draw.block(this.box.getShape(),this.box.getPos(),this.box.getSides(),'olive');
            //this.canvas.appendChild(this.drawDiv);
            this.render('olive');
            this.box.reset();    //�ںϳɹ�����������
            console.log(this.map.area);
        }
    };

    Game.prototype.render = function(color) {
        this.draw.erase(this.drawDiv);
        this.drawDiv = this.draw.block(this.box.getShape(),this.box.getPos(),this.box.getSides(),color);
        this.canvas.appendChild(this.drawDiv);
    };

    //��ѭ��
    Game.prototype.mainLoop = function() {
        if(!this.init()) {
            if(!this.moveBox(1)) {
                //�ں�
                this.fuse();
                this.afterFuse();
                this.init();
            }
        }
    };

    Game.prototype.afterFuse = function() {
        var line = this.map.remove();
        if (0 != line) {
            this.score += this.scoreLevel[line];console.log(this.score);
            this.scoreDom.innerHTML = this.score;
            this.clearMap();
            this.drawMap();
        }
    };

    Game.prototype.init = function() {
        //������ɷ���
        if(this.box.getPos()==null) {
            this.box.getRandomBox();
            if(!this.map.collision(this.box.getPos(),this.box.getPoint())) {
                this.flag = false;
                alert('fail');
                this.reset();
                return false;
            }
            this.drawDiv = this.draw.block(this.box.getShape(), this.box.getPos(),this.box.getSides(),this.box.getColor());
            this.canvas.appendChild(this.drawDiv);
            return true;
        } else {
            return false;
        }
    };

    Game.prototype.reset = function() {
        this.map.reset();
        this.box = null;
        this.score = 0; //����
        this.flag = true;   //��Ϸ״̬��false��ʾʧ��
        this.scoreDom.innerHTML = 0;
        this.clearMap();
    };

    //�����������
    Game.prototype.clearMap = function() {
        while(this.canvas.hasChildNodes()) {
            this.canvas.removeChild(this.canvas.firstChild);
        }
        console.log(this.map.area);
    };

    //���»�����������
    Game.prototype.drawMap = function() {
        var length = this.map.area.length;
        for(var i = 0;i<length;i++) {
            for(var j=0;j<this.map.area[i].length;j++) {
                if(this.map.area[i][j]==1) {
                    //����
                    this.canvas.appendChild(this.draw.drawing((j+1),i,this.box.getSides(),"olive"));
                }
            }
        }
    };
