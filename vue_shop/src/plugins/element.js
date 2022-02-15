import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,Container,
         Header,Aside,Main,Menu,Submenu,MenuItemGroup,
         MenuItem ,BreadcrumbItem,Breadcrumb,Card,Option,
         Col,Row,Table,TableColumn,Switch,Tooltip,
         Pagination,Dialog,MessageBox,Tag,Tree,Cascader,
         Select,Alert,Tabs,TabPane,Steps,Step,CheckboxGroup,
         Checkbox,Upload
} from 'element-ui'
//组件
import Timeline from './timeline/index'
import TimelineItem from './timeline-item/index'
Vue.use(Button)
Vue.use(Steps)
Vue.use(Upload)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Form)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Select)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Option)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Timeline)
Vue.use(TimelineItem)
//挂在prototyp原型对象上
Vue.prototype.$message=Message
Vue.prototype.$confirm =MessageBox.confirm
