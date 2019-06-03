<template>
  <div class="page">
		<header>
			<h3>购物车</h3>
		</header>
    <div class="shop_car_body">
    	<ul>
    		<li v-for="(item, index) in  list">
    			<div class="car_list_top">
    				<div class="car_list_t_l">
    					<!-- 选择商品 -->
    					<div class="input_check">
    						<span class="ico_gou"
								:class="{'ico_gou_on':item.checked}" 
    						@click="selectGoods(item)"></span>
    					</div>
    					<!-- 选择商品 end -->
    					<P>商家: {{item.shop_name}}</P>
    				</div>
    				<div class="car_list_t_r">
    					<p class="ico_del" @click="delGoods(item.goods_id,index)"></p>
    				</div>
    			</div>
    			<div class="car_list_center">
    				<div class="car_list_c_l">
    					<img :src="'http:'+item.goods_img" alt="">
    				</div>
    				<div class="car_list_c_r">
    					<p>{{item.goods_name}}</p>
    					<div class="goods_intor">
    						<p>￥{{item.price}}</p>
    						<p class="select_num_input">
    							<span class="ico_sub" @click="sub(item.sales_num,index)"></span>
    							<input type="number" :value="item.sales_num" disabled>
    							<span class="ico_plus" @click="plus(item.sales_num,index)"></span>
    						</p>
    					</div>
    				</div>
    			</div>
    		</li>
    	</ul>
    	<div class="car_footer">
    		<div class="car_footer_l" v-show="!checkAllFlag">
    			<span class="ico_gou" @click="checkAll(true)"></span>
    			<p>全选</p>
    		</div>
    		<div class="car_footer_l" v-show="checkAllFlag">
    			<span class="ico_gou_on" @click="checkAll(false)"></span>
    			<p>取消全选</p>
    		</div>
    		<div class="car_footer_r">
    			<span>合计：{{$setNum.Dec(totalMoney,2)}}</span>
    			<p @click="toDo()">结算({{checkNum}})</p>
    		</div>
    	</div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator, MessageBox} from 'mint-ui'
export default {
  data () {
    return {
      list:[],
    	selectId:[],  //选中的商品id
    	totalMoney: 0,  //总价
    	checkNum: 0,  //选择的商品数量(结算需要显示的数量)
    	checkAllFlag:false,  //是否全选
    }
  },
	computed: {
	},
	methods: {
		// 点击结算
		toDo(){
			if(this.checkNum <= 0){
				Toast('先选中需要结算的商品');
			}
			else{
				// 结算选中的商品
				var isList = [];
				for(var i in this.list){
					if(this.list[i].checked){
						isList.push(this.list[i]);
					}
				}				
				console.log(isList,'在控制台打开查看数据');
			}
		},
		// (单选)选择商品
		selectGoods(item){
			//判断是否未定义，如果没点击过按钮是没有注册的，则需要先注册checked属性
			if(typeof item.checked =='undefined'){
				this.$set(item,"checked",true);
				this.checkNum ++;  //结算需要显示的数量
			}else{
				//  如果已经注册，则设置checked否(这里不能设置为false,因为当已经注册过之后再点击为flase，那么再点击一次则为true)
				item.checked = !item.checked;
				item.checked ? this.checkNum ++ : this.checkNum --;
			}
			// 求总价
			this.totalPrice();
			// 当所有的商品都选择的时候，自动默认为全选
			this.list.length == this.checkNum ? this.checkAll(true) : this.checkAllFlag = false;
		},
		// 全选与取消全选，点击全选时flag为true,取消时为false
		checkAll(flag){
			this.checkAllFlag = flag;
			var _this = this;
			flag ? this.checkNum = this.list.length : this.checkNum = 0;
			this.list.forEach(function(item,index){
				if(typeof item.checked == 'undefined'){//也要防止未定义
					_this.$set(item,"checked",_this.checkAllFlag);//通过set来给item添加属性checked
				}else{
					item.checked = _this.checkAllFlag;
				}
			});
			this.totalPrice();
		},
		// 求总价
		totalPrice(){
			var _this = this;
			this.totalMoney = 0;
			this.list.forEach((item,index)=>{
				if(item.checked){
					_this.totalMoney += this.$setNum.accMul(item.price,item.sales_num);
				}
			});
		},
		// 删除商品
		delGoods(id,index){
			MessageBox.confirm('',{
				title:'',
				message:'确定删除该商品吗？',
				confirmButtonText:'确定',
				cancelButtonText:'取消'
			}).then(action => {
				if (action == 'confirm') {
					// 刷新类表
					this.getList();
					// 取消全选
					this.checkAll(false);
				}
			}).catch(error =>{});
		},
		// 数量减方法
		sub(num,index){
			if(parseInt(num) <= 1){
				// 最小数量必须为1,所以当数量减到最小的时候，默认为1
				this.list[index].sales_num = 1;
			}
			else{
				this.list[index].sales_num = parseInt(this.list[index].sales_num) - 1;
			}
			this.totalPrice();
		},
		// 数量加方法
		plus(num,index){
			this.list[index].sales_num = parseInt(this.list[index].sales_num) + 1;
			this.totalPrice();
		},
		// 获取购物车列表
		getList(){
			var _this = this;
			this.$http.get("/static/data/data.json").then(function(res){
				_this.list = res.data.list;
			});
		}
	},
	mounted(){
		this.getList();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "./../styles/index.less";
.page{
	.mt(88);
	.mb(110);
	.pt(20);
}
header{
	.h(88);
	.lh(88);
	background: @base-color;
	color: #fff;
	.fs(32);
	text-align: center;
	position: fixed;
	.left(0);
	.top(0);
	width: 100%;
	z-index: 100;
}
.shop_car_body{
	.w-calc(48);
	.ml(24);
	ul{
		li{
			.b-radius(16);
			background: #fff;
			.mb(20);
			.fs(28);
			.padding(0,24);
			.pb(24);
			.car_list_top{
				.fs(30);
				display: flex;
				justify-content: space-between;
				align-items: center;
				.padding(24,0);
				.car_list_t_l{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.input_check{
						position: relative;
						.mr(20);
						.w(40);
						.h(40);
						span{
							display: block;
							position: absolute;
							.top(4);
							.left(4);
							.w(36);
							.h(36);
							.bgs(36,36);
						}
					}
				}
				.car_list_t_r{
					p.ico_del{
						.w(36);
						.h(40);
						.bgs(36,40);
					}
				}
			}
			.car_list_center{
				display: flex;
				justify-content: flex-start;
				.car_list_c_l{
					img{
						display: block;
						.w(160);
						.h(160);
						object-fit: cover;
					}
				}
				.car_list_c_r{
					.ml(20);
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: flex-start;
					.w-calc(140);
					p:nth-child(1){
						text-align: left;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.goods_intor{
						display: flex;
						justify-content: space-between;
						align-items: center;
						width: 100%;
						.select_num_input{
							display: flex;
							justify-content: center;
							align-items: center;
							span{
								display: flex;
								justify-content: center;
								align-items: center;
								@ico_s:40;
								.w(@ico_s);
								.h(@ico_s);
								.bgs(@ico_s,@ico_s);
								&:active{
									opacity: .5;
								}
							}
							input[type=number]{
								.w(60);
								text-align: center;
								background: none;
							}						
						}
					}
				}
			}
		}
	}
	// footer
	.car_footer{
		.border-top(2,#eee);
		position: fixed;
		.left(0);
		.bottom(0);
		.w-calc(48);
		background: #fff;
		.h(88);
		.fs(30);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.padding(0,24);
		.car_footer_l{
			.fs(28);
			color: @base-color;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			p{
				.ml(20);
			}
			span{
				display: block;
				.w(36);
				.h(36);
				.bgs(36,36);
			}
		}
		.car_footer_r{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			span{
				display: block;
				.mr(30);
			}
			p{
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
				.h(60);
				.padding(0,30);
				.b-radius(30);
				background: linear-gradient(45deg, #ff6924, #fe8701);				
			}
		}
	}
}
</style>

